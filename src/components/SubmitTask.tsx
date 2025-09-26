'use client'

import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { API_ENDPOINTS } from "@/app/constants/api";

export default function FilePickerWithConfirm() {
  const t = useTranslations();

  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState(null);
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

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file)
    } else {
      setFileName(null);
      setFile(null);
    }
  }

  const cleanFileName = () => {
    setFileName(null);
    setFile(null);
  }

  const handleSubmit = async () => {
    setError(null);
    if (!text) {
      setError(t('Process.descriptionError'));
      return;
    }
    if (!file) {
      setError(t('Process.fileError'));
      return;
    }
    setProcessing(true);
    setMessage(t("Process.taskSubmitMsg"));

    // 创建 FormData
    const formData = new FormData();
    formData.append("file", file);
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
    setFile(null);
    setFileName(null);
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
    <div>
      {processing ? (
        <div className="p-6">
          {
            execStatus == 'success' ? (
              <div className="max-w-xl mx-auto p-6 flex flex-col gap-5 items-center justify-center border border-gray-300 rounded-lg">
                <p className="ml-2 text-gray-500 text-xl text-center">{message}</p>

                <div className="flex gap-5 items-center justify-center">
                  <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={downloadFile}>{t("Process.downloadFileBtn")}</button>

                  <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={resetAll}>{t("Process.resubmitBtn")}</button>
                </div>
              </div>
            ) : execStatus == 'error' ? (
              <div className="max-w-xl mx-auto p-6 flex flex-col gap-5 items-center justify-center border border-gray-300 rounded-lg">
                <p className="ml-2 text-gray-500 text-xl text-center">{message}</p>

                <button className="px-2 py-1 [background-color:#1a73e8] text-white rounded-lg shadow-md hover:[background-color:#1558b0] active:scale-95 transition" onClick={resetAll}>{t("Process.resubmitBtn")}</button>
              </div>
            ) : (
              <div className="max-w-xl mx-auto p-6 flex items-center justify-center border border-gray-300 rounded-lg">
                <div className="w-5 h-5 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                <div className="ml-2 text-gray-500 text-xl">{message}</div>
              </div>
            )
          }
        </div>
      ) : (
        <div className="max-w-xl mx-auto p-6">
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <div className="flex flex-col">
              <div>
                <textarea className="w-full min-h-24 max-h-64 resize-none outline-none border-none focus:ring-0" onChange={handleTextChange}></textarea>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  {!fileName && (
                    <label
                      className="flex items-center justify-center text-2xl"
                      title={t('Process.selectFileHint')}
                    >
                      +
                      <input
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        className="hidden"
                        id="fileInput"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  {fileName && (
                    <div className="flex border rounded-lg px-2">
                      <span className="text-center text-gray-700 block w-[20ch] truncate mr-2">{fileName}</span>
                      <span onClick={cleanFileName}>x</span>
                    </div>
                  )}
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
