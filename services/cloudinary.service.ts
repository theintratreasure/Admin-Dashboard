export async function uploadToCloudinary(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  if (!data.secure_url || !data.public_id) {
    throw new Error("Cloudinary upload failed");
  }
  return data;
}
