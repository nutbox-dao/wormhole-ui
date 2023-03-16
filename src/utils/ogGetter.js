import axios   from 'axios'
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js'

export async function getPageOg(url) {
    try {
        const str = await getLinkPreview(url, {
            imagesPropertyType: 'og',
            timeout: 1000
        })
        return str
    }catch(e) {
        return {}
    }
}