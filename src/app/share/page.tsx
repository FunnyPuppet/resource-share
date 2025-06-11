'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addResource } from '@/app/lib/client/services/resourceService'
import { Category, getCategory } from '@/app/lib/client/services/categoryService'

type PanLink = {
  type: string
  link: string
}

export default function Share() {
  const [title, setTitle] = useState('')
  const [resourceDetail, setResourceDetail] = useState('')
  const [resourceCategory, setResourceCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [links, setLinks] = useState<PanLink[]>([{ type: '', link: '' }])

  const [panCategorys, setPanCategorys] = useState<Category[]>([])
  const [resourceCategorys, setResourceCategorys] = useState<Category[]>([])

  const validateData = async () => {
    if (!title.trim()) {
      alert("标题不能为空！")
      return false
    }

    if (!resourceCategory.trim()) {
      alert("资源分类不能为空！")
      return false
    }

    if (tags.length < 1) {
      alert("请输入至少一个标签！")
      return false
    }

    return true
  }

  const sumbitResource = async () => {
    if (await validateData()) {
      const res = await addResource({
        "title": title,
        "panLinks": links,
        "resourceCategory": resourceCategory,
        "resourceDetail": resourceDetail,
        "tags": tags
      })

      if (res.data?.status == 200) {
        alert("添加成功")
        setTitle('')
        setResourceDetail('')
        setResourceCategory('')
        setTags([])
        setLinks([{ type: '', link: '' }])
      } else {
        alert("添加失败")
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const pcs = await getCategory("pan")
      setPanCategorys(pcs.data || [])
      const rcs = await getCategory("resource")
      setResourceCategorys(rcs.data || [])
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputVisible])

  const handleChange = (index: number, field: keyof PanLink, value: string) => {
    const updated = [...links]
    updated[index][field] = value
    setLinks(updated)
  }

  const handleAdd = () => {
    console.log(11)
    setLinks([...links, { type: '', link: '' }])
  }

  const handleRemove = (index: number) => {
    const updated = [...links]
    updated.splice(index, 1)
    setLinks(updated)
  }

  const handleAddTag = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setInputValue('')
    setInputVisible(false)
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <main>
      <div className="bg-white p-4">
        <div className="flex flex-col gap-2 text-gray-500 mb-4">
          <p>为了让更多用户受益，我们诚挚邀请您参与资源分享！如果您拥有优质的网盘资源，欢迎提交分享链接。</p>
          <p>分享说明：</p>
          <p>资源类型不限：视频教程、学习资料、软件工具、电子书、图集等均可。</p>
          <p>资源链接要求：请确保链接真实有效，可公开访问，建议使用常见网盘（如百度网盘、阿里云盘等）。</p>
          <p>资源信息完整：请尽可能填写资源标题、简要介绍、所属分类和标签，方便他人检索与使用。</p>
          <p>禁止违法资源：请勿上传或分享任何违法、侵权、色情、血腥暴力等违规内容，一经发现将予以删除。</p>
          <p>版权声明：请确保您有权分享该资源或该资源为网络公开内容，如有侵权请立即停止分享。</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="text-right block text-sm font-medium min-w-[80px]">标题：</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-gray-500 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入资源标题"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-right block text-sm font-medium min-w-[80px]">资源分类：</label>
            <select
              value={resourceCategory}
              onChange={e => setResourceCategory(e.target.value)}
              className="min-w-[150px] max-w-[400px] text-gray-500 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option className="text-gray-500" value="">请选择</option>
              {
                resourceCategorys.map((category, index) => (
                  <option className="text-gray-500" key={index} value={category.code}>{category.name}</option>
                ))
              }
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-right block text-sm font-medium min-w-[80px]">标签：</label>
            <div className={tags.length == 0 ? "hidden" : "flex flex-wrap gap-2"}>
              {tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-red-500">×</button>
                </span>
              ))}
            </div>

            <AnimatePresence>
              {inputVisible && (
                <motion.input
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  ref={inputRef}
                  type="text"
                  className="w-[100px] border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    console.log(e.key)
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    } else if (e.key === 'Escape') {
                      setInputVisible(false)
                      setInputValue('')
                    }
                  }}
                  onBlur={() => setInputVisible(false)}
                />
              )}
            </AnimatePresence>

            {!inputVisible && (
              <button
                type="button"
                onClick={() => setInputVisible(true)}
                className="text-blue-500 border border-blue-300 rounded-full px-2 py-1 text-sm hover:bg-blue-50"
              >
                ＋
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <div className="text-sm font-medium min-w-[80px]">
              <label className="text-right block">资源详情：</label>
            </div>
            <div className="flex w-full gap-4">
              <textarea
                id="resourceDetail"
                name="resourceDetail"
                value={resourceDetail}
                onChange={e => setResourceDetail(e.target.value)}
                rows={4}
                className="w-full rounded-md text-gray-500 border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="请输入资源的详细描述..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-sm font-medium min-w-[80px]">
              <label className="text-right block">网盘链接：</label>
            </div>
            <div className="flex flex-col gap-4">
              {links.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={item.type}
                    onChange={e => handleChange(index, 'type', e.target.value)}
                    className="min-w-[100px] max-w-[400px] text-gray-500 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option className="text-gray-500" value="">请选择</option>
                    {
                      panCategorys.map((category, index) => (
                        <option className="text-gray-500" key={index} value={category.code}>{category.name}</option>
                      ))
                    }
                  </select>
                  <input
                    type="text"
                    value={item.link}
                    onChange={e => handleChange(index, 'link', e.target.value)}
                    className="w-full text-gray-500 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入网盘链接"
                  />
                  <button
                    type="button"
                    onClick={() => { if (links.length > 1) handleRemove(index) }}
                    className={links.length > 1 ? "text-blue-500 px-2 py-1 text-2xl" : "text-gray-500 px-2 py-1 text-2xl"}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (links.length < 10) handleAdd() }}
                    className="text-blue-500 px-2 py-1 text-2xl"
                  >
                    ＋
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="py-4">
            <button
              type="submit"
              className="w-full bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={sumbitResource}
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </main >
  )
}
