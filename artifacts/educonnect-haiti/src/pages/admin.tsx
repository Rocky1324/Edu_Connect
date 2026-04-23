import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import {
  saveLessonVideo,
  deleteLessonVideo,
  listLessonVideos,
} from "@/lib/lesson-storage";
import { toast } from "sonner";
import { CheckCircle2, Trash2, Upload, Info } from "lucide-react";

export default function Admin() {
  const [stored, setStored] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const keys = await listLessonVideos();
      setStored(keys);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpload = async (chapterId: string, file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Veuillez choisir un fichier vidéo (MP4, WebM…).");
      return;
    }
    const MAX = 200 * 1024 * 1024;
    if (file.size > MAX) {
      toast.error("Fichier trop lourd (max 200 Mo).");
      return;
    }
    try {
      await saveLessonVideo(chapterId, file);
      toast.success("Vidéo enregistrée pour ce chapitre.");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Échec de l'enregistrement.");
    }
  };

  const handleDelete = async (chapterId: string) => {
    try {
      await deleteLessonVideo(chapterId);
      toast.success("Vidéo retirée.");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Échec de la suppression.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
          Espace Enseignant
        </h1>
        <p className="text-muted-foreground mb-6">
          Téléversez vos propres vidéos de leçons (MP4, WebM). Elles remplacent
          la vidéo YouTube du chapitre correspondant.
        </p>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-8 flex gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <strong>Stockage local uniquement.</strong> Les vidéos téléversées
            ici sont enregistrées dans ce navigateur (sur cet appareil). Elles
            ne sont pas partagées avec les autres élèves. Pour distribuer une
            leçon à toute votre classe, déposez le MP4 dans le dossier{" "}
            <code className="bg-amber-100 px-1 rounded">public/lessons/</code>{" "}
            du projet et publiez une nouvelle version, ou ajoutez un vrai
            serveur de stockage.
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : (
          <div className="space-y-8">
            {courses.map((course) => (
              <section key={course.id} className="border rounded-2xl p-6 bg-card">
                <h2 className="text-xl font-bold mb-1">{course.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.subject} · {course.level}
                </p>
                <div className="space-y-3">
                  {course.chapters.map((chapter) => {
                    const has = stored.includes(chapter.id);
                    return (
                      <div
                        key={chapter.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {chapter.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {has
                              ? "Vidéo locale active"
                              : "Aucune vidéo locale"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {has && (
                            <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Active
                            </span>
                          )}
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUpload(chapter.id, f);
                                e.target.value = "";
                              }}
                            />
                            <Button asChild size="sm" variant="outline">
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                {has ? "Remplacer" : "Téléverser"}
                              </span>
                            </Button>
                          </label>
                          {has && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
