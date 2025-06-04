import Image from "next/image";

export default function Home() {
  return (
    <main className="p-1">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 space-y-4">
          {/* Carousel Section */}
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">轮播图区域</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <section className="p-4 border flex-1">
              <p className="text-xl font-semibold mb-4">精品</p>
              <p>精品内容区域</p>
            </section>

            <section className="p-4 border flex-1">
              <p className="text-xl font-semibold mb-4">最新</p>
              <p>最新内容区域</p>
            </section>

            <section className="p-4 border flex-1">
              <p className="text-xl font-semibold mb-4">最热门</p>
              <p>最热门内容区域</p>
            </section>
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <section className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">网站公告</h2>
            <p>公告内容区域</p>
          </section>
        </div>
      </div>
    </main>
  );
}
