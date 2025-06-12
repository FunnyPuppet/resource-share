"use client"

export default function Help() {
  return (
    <main>
      <div className="p-4 bg-white text-gray-500">
        <div className="flex flex-col gap-4 mb-4">
          <p>欢迎使用资源帮招功能！如果你正在寻找某个资源但在网站中暂未找到，可以通过此页面发布求助信息，其他热心用户看到后将有机会帮你提供资源。</p>
          <p>温馨提示：</p>
          <p>&nbsp;&nbsp;请勿发布违法、违规、侵权类资源请求；</p>
          <p>&nbsp;&nbsp;请勿重复发布相同求助信息；</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="text-sm font-medium min-w-[80px]">
              <label className="text-right block">资源描述：</label>
            </div>
            <div className="flex w-full gap-4">
              <textarea
                rows={4}
                placeholder="请输入你需要的资源信息，尽量保证信息足够详细"
                className="w-full rounded-md text-gray-500 border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="py-4 border-b border-gray-300">
            <button
              type="submit"
              className="w-full bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {}}
            >
              提交
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-2xl font-medium">需求列表</div>
            <div className="flex flex-col gap-2 border rounded border-gray-300 p-4">
              <div>资源需求：物联网/嵌入式全能工程师</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
