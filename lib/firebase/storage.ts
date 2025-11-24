import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './config'

// Compress image before uploading
const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality
        )
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Upload image to Firebase Storage
export const uploadThreadImage = async (file: File, threadId: string): Promise<string> => {
  if (!storage) throw new Error('Firebase Storage not initialized')

  try {
    // Compress the image first
    const compressedBlob = await compressImage(file, 1920, 1920, 0.8)

    // Create a reference to the file location
    const imageRef = ref(storage, `threads/${threadId}/${Date.now()}_${file.name}`)

    // Upload the compressed image
    await uploadBytes(imageRef, compressedBlob)

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)

    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

// Upload avatar image
export const uploadAvatarImage = async (file: File, userId: string): Promise<string> => {
  if (!storage) throw new Error('Firebase Storage not initialized')

  try {
    // Compress avatar to smaller size (square, max 512x512)
    const compressedBlob = await compressImage(file, 512, 512, 0.9)

    // Create a reference to the file location
    const avatarRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`)

    // Upload the compressed image
    await uploadBytes(avatarRef, compressedBlob)

    // Get the download URL
    const downloadURL = await getDownloadURL(avatarRef)

    return downloadURL
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw new Error('Failed to upload avatar')
  }
}

// Upload chat attachment (image or file)
export const uploadChatAttachment = async (file: File, threadId: string): Promise<string> => {
  if (!storage) throw new Error('Firebase Storage not initialized')

  try {
    // If image, compress. Else upload as is.
    let fileToUpload: Blob | File = file
    if (file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file, 1920, 1920, 0.8)
    }

    const fileRef = ref(storage, `threads/${threadId}/attachments/${Date.now()}_${file.name}`)
    await uploadBytes(fileRef, fileToUpload)
    return getDownloadURL(fileRef)
  } catch (error) {
    console.error('Error uploading attachment:', error)
    throw new Error('Failed to upload attachment')
  }
}

