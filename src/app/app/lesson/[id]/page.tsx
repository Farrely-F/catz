import { notFound } from "next/navigation";
import { LessonRunner } from "@/components/lesson/lesson-runner";
import { LESSONS, lessonById } from "@/lib/curriculum";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: PageProps<"/app/lesson/[id]">) {
  const { id } = await params;
  if (!lessonById(id)) notFound();
  return <LessonRunner id={id} />;
}
