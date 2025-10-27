'use client'

import clsx from 'clsx';
import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { API_ENDPOINTS } from "@/app/constants/api";

export default function FilePickerWithConfirm() {
  const t = useTranslations();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [execStatus, setExecStatus] = useState<string>("processing");

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
    debugger;

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

      // 允许的文件类型
      const allowedExts = ["csv", "xls", "xlsx"];

      if (!ext || !allowedExts.includes(ext)) {
        setError(t('Process.fileExtError'));
        setFiles([]);
        setFileNames([]);
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      // 限制为10MB
      if (fileSizeMB > 10) {
        setError(t('Process.fileSizeError'));
        return;
      }
    }

    setProcessing(true);
    setMessage(t("Process.taskSubmitMsg"));

    // 创建 FormData
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("lang", t("Metadata.lang"));
    formData.append("description", text);

    // 上传到 API
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
      const response = await fetch(API_ENDPOINTS.DOWNLOAD + `/${taskId}`);
      if (!response.ok) throw new Error(t("Process.downloadFailMsg"));

      // 获取 blob
      const blob = await response.blob();

      // 创建临时 URL
      const url = window.URL.createObjectURL(blob);

      // 创建 a 标签下载
      const a = document.createElement('a');
      a.href = url;
      a.download = `${taskId}.zip`;
      document.body.appendChild(a);
      a.click();

      // 清理
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(t("Process.downloadFailMsg"));
    }
  }

  return (
    <div className="w-full">
      {processing ? (
        <div className="p-6">
          {
            execStatus == 'success' ? (
              <div className="max-w-3xl mx-auto min-h-28 max-h-64 shadow-xl p-6 flex flex-col gap-5 items-center justify-center border border-gray-300 rounded-2xl">
                <p className="ml-2 text-gray-500 text-xl text-center">{message}</p>

                <div className="flex gap-5 items-center justify-center">
                  <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={downloadFile}>{t("Process.downloadFileBtn")}</button>

                  <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={resetAll}>{t("Process.resubmitBtn")}</button>
                </div>
              </div>
            ) : execStatus == 'error' ? (
              <div className="max-w-3xl mx-auto min-h-28 max-h-64 shadow-xl p-6 flex flex-col gap-5 items-center justify-center border border-gray-300 rounded-2xl">
                <p className="ml-2 text-gray-500 text-xl text-center">{message}</p>

                <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={resetAll}>{t("Process.resubmitBtn")}</button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto min-h-28 max-h-64 shadow-xl p-6 flex items-center justify-center border border-gray-300 rounded-2xl">
                <div className="w-5 h-5 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                <div className="ml-2 text-gray-500 text-xl">{message}</div>
              </div>
            )
          }
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-6">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-3 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <div className="flex flex-col">
              <div className="grid grid-cols-3 gap-2">
                    {fileNames && fileNames.length > 0 && (
                      fileNames.map((name, index) => (
                        <div className="flex border rounded-lg px-2 py-1" key={index}>
                          <span className="text-gray-700 block w-[20ch] truncate mr-2">{name}</span>
                          <span onClick={() => cleanFile(name)}>x</span>
                        </div>
                      ))
                    )}
                  </div>
              <div>
                <textarea className="w-full min-h-28 max-h-64 py-2 resize-none outline-none border-none focus:ring-0" onChange={handleTextChange}></textarea>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">

                  <label
                    className="flex items-center justify-center text-2xl"
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
                </div>

                <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={handleSubmit}>{t('Process.submitBtn')}</button>
              </div>
            </div>
          </div>

          <div>
            {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
