"use server";
import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("제목을 입력하세요.");
  }

  if (!content || content.trim().length === 0) {
    errors.push("내용을 입력하세요.");
  }

  if (!image || image.size === 0) {
    errors.push("이미지를 추가하세요.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl = "";

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "이미지 업로드에 실패하여 게시물을 생성하지 못했습니다. 잠시 후 다시 시도해주세요."
    );
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
