import { request } from "@/utils/request"

/**
 * 文件上传
 * @param file 文件
 * @returns
 */
export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request<string>({
    url: "/admin/file/upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
