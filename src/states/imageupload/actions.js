export default async function imageUpload(params) {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post(`imageupload`, params)
    return await response.data;
}