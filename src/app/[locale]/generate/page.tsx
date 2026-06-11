'use client'

import clsx from 'clsx';
import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { API_ENDPOINTS } from "@/app/constants/api";


export default function GeneratePage() {
    const t = useTranslations();

    const [fileNames, setFileNames] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [execStatus, setExecStatus] = useState<string>("processing");
    const [htmlURL, setHtmlURL] = useState<string>("");
    const [fileType, setFileType] = useState<string>("markdown");

    useEffect(() => {
        if (!taskId) return;

        const eventSource = new EventSource(API_ENDPOINTS.SSE + `/${taskId}`);

        eventSource.onmessage = (event) => {
            const jsonData = JSON.parse(event.data);

            if (jsonData.type == 2 && jsonData.status == 2) {
                setExecStatus("error");
            }
            if (jsonData.type == 2 && jsonData.status == 1) {
                setExecStatus("success");
                setHtmlURL(API_ENDPOINTS.PREVIEW + `/${taskId}`)
            }
            setMessage(jsonData.msg);

            if (jsonData.type == 2) {
                eventSource.close();
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [taskId]);

    const handleTextChange = (e: any) => {
        setText(e.target.value);
    };

    const handleFileChange = (e: any) => {
        const files = e.target.files;

        if (files.length > 0) {
            setFiles(files);
            const names: string[] = fileNames ? [...fileNames] : [];
            const fileList: File[] = files ? [...files] : [];
            for (let i = 0; i < files.length; i++) {
                names.push(files[i].name);
                fileList.push(files[i]);
            }
            setFileNames(names);
            setFiles(fileList);
        } else {
            setFiles([]);
            setFileNames([]);
        }
    }

    const cleanFile = (name: string) => {
        setFileNames((prev) => prev?.filter((n) => n !== name) || null);
        setFiles((prev) => prev.filter((file) => file.name !== name));
    }

    const handleSubmit = async () => {
        setError(null);
        if (!text) {
            setError(t('Process.descriptionError'));
            return;
        }
        if (!files || files.length == 0) {
            setError(t('Process.fileError'));
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const ext = file.name.split(".").pop()?.toLowerCase();

            const allowedExts = ["csv", "xls", "xlsx"];

            if (!ext || !allowedExts.includes(ext)) {
                setError(t('Process.fileExtError'));
                setFiles([]);
                setFileNames([]);
                return;
            }

            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 10) {
                setError(t('Process.fileSizeError'));
                return;
            }
        }

        setProcessing(true);
        setMessage(t("Process.taskSubmitMsg"));

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("lang", t("Metadata.lang"));
        formData.append("description", text);

        const res = await fetch(API_ENDPOINTS.WORKFLOW_INIT, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setTaskId(data["task_id"]);
    }

    const resetAll = async () => {
        setText("");
        setFiles([]);
        setFileNames([]);
        setProcessing(false);
        setExecStatus("processing");
    }

    const downloadFile = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.DOWNLOAD + `/${taskId}/${fileType}`);
            if (!response.ok) throw new Error(t("Process.downloadFailMsg"));

            const fileTypes = ["resource", "markdown", "html", "pdf"];
            if (!fileTypes.includes(fileType)) {
                alert(t("Process.downloadFailMsg"));
                return;
            }

            let fileExt = "zip";
            if (fileType == "markdown") {
                fileExt = "md";
            } else if (fileType == "html") {
                fileExt = "html";
            } else if (fileType == "pdf") {
                fileExt = "pdf";
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${taskId}.${fileExt}`;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(t("Process.downloadFailMsg"));
        }
    }

    return (
        <main className="relative z-10">
            <div className={clsx('flex justify-center w-full px-4', {
                'items-center': !(execStatus && execStatus == 'success'),
                'min-h-screen': !(execStatus && execStatus == 'success')
            })}>
                <div className="w-full">
                    {processing ? (
                        <div className="overflow-x-hidden">
                            {
                                execStatus == 'success' ? (
                                    <div className='flex flex-col'>
                                        {/* 成功状态 - 工具栏 */}
                                        <div className='text-center mt-6 mb-4'>
                                            <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-center rounded-2xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl">
                                                <div className="flex gap-3 items-center justify-center flex-wrap">
                                                    <select
                                                        value={fileType}
                                                        onChange={(e) => setFileType(e.target.value)}
                                                        className="px-3 py-2 bg-gray-900 text-cyan-200 rounded-lg border border-cyan-500/30 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                                                    >
                                                        <option value="markdown">Markdown</option>
                                                        <option value="html">Html</option>
                                                        <option value="pdf">PDF</option>
                                                        <option value="resource">{t('Process.fileType.resource')}</option>
                                                    </select>

                                                    <button
                                                        className="btn-tech px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all text-sm font-medium"
                                                        onClick={() => downloadFile()}
                                                    >
                                                        {t("Process.downloadFileBtn")}
                                                    </button>

                                                    <button
                                                        className="btn-tech px-4 py-2 bg-white/5 text-cyan-200 rounded-lg border border-cyan-500/30 hover:border-cyan-400 hover:bg-white/10 active:scale-95 transition-all text-sm font-medium"
                                                        onClick={resetAll}
                                                    >
                                                        {t("Process.resubmitBtn")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 预览区 */}
                                        <div className='flex justify-center px-2'>
                                            <div className="relative w-full max-w-[820px] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                                                {/* 预览区顶部装饰条 */}
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-cyan-500/10">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                                                    {/* <span className="ml-3 text-xs text-blue-200/30">preview</span> */}
                                                </div>
                                                <div className="w-full h-screen bg-white p-5">
                                                    <iframe src={htmlURL} className="w-full h-screen bg-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : execStatus == 'error' ? (
                                    <div className="flex items-center justify-center min-h-[60vh]">
                                        <div className="max-w-xl w-full p-8 flex flex-col gap-6 items-center justify-center rounded-2xl border border-red-500/20 bg-white/[0.03] backdrop-blur-xl mx-1 sm:mx-0">
                                            {/* 错误图标 */}
                                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
                                                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <p className="text-red-300 text-lg text-center">{message}</p>

                                            <button
                                                className="btn-tech px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all text-sm font-medium"
                                                onClick={resetAll}
                                            >
                                                {t("Process.resubmitBtn")}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 处理中状态 */
                                    <div className='flex items-center justify-center min-h-[60vh] mx-1 sm:mx-0'>
                                        <div className="max-w-xl w-full p-8 flex flex-col gap-8 items-center justify-center rounded-2xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl">
                                            {/* 跳动点 - 霓虹色 */}
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(0,240,255,0.6)]"></div>
                                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
                                            </div>

                                            {/* 旋转加载器 */}
                                            <div className="w-16 h-16 border-[3px] border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin-glow"></div>

                                            <p className="text-cyan-200/80 text-lg">{message}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        /* 初始表单状态 */
                        <div className="max-w-3xl mx-auto pt-6 sm:pt-16 pb-16">
                            {/* 标题 */}
                            <div className="mb-8 text-center">
                                <p className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent'>
                                    {t('Process.beginTitle')}
                                </p>
                                <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            </div>

                            {/* 表单卡片 */}
                            <div className="rounded-2xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]">
                                <div className="flex flex-col gap-4">
                                    {/* 文件标签区 */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {fileNames && fileNames.length > 0 && (
                                            fileNames.map((name, index) => (
                                                <div
                                                    className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-cyan-500/8 border border-cyan-500/30 text-sm group hover:border-cyan-400/60 transition-all"
                                                    key={index}
                                                >
                                                    <span className="text-cyan-200 block w-[16ch] truncate">{name}</span>
                                                    <span
                                                        onClick={() => cleanFile(name)}
                                                        className="ml-2 cursor-pointer text-cyan-400/50 hover:text-red-400 transition-colors font-mono text-lg leading-none"
                                                    >
                                                        ×
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* 文本输入 */}
                                    <div>
                                        <textarea
                                            className="w-full min-h-32 max-h-52 py-3 px-1 resize-none bg-transparent text-cyan-50 placeholder-blue-300/20 focus:outline-none text-base"
                                            placeholder={t('Metadata.description')}
                                            onChange={handleTextChange}
                                        ></textarea>
                                    </div>

                                    {/* 底部操作栏 */}
                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                        <div className="flex items-center">
                                            <label
                                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-2xl cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-light"
                                                title={t('Process.selectFileHint')}
                                            >
                                                +
                                                <input
                                                    type="file"
                                                    accept=".csv,.xls,.xlsx"
                                                    className="hidden"
                                                    multiple
                                                    id="fileInput"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <span className="ml-3 text-blue-200/20 text-xs hidden sm:inline">
                                                CSV, Excel (max 10MB)
                                            </span>
                                        </div>

                                        <button
                                            className="btn-tech px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white text-base font-semibold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
                                            onClick={handleSubmit}
                                        >
                                            {t('Process.submitBtn')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 错误提示 */}
                            <div>
                                {error && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}