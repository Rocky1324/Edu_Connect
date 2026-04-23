import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ArrowRight, DownloadCloud, CheckCircle2, PlayCircle, BookText, PenTool, Check, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { courses } from "@/data/courses";
import { toast } from "sonner";

export default function CourseDetail() {
  const [, params] = useRoute("/cours/:id");
  const courseId = params?.id;
  const course = courses.find(c => c.id === courseId);
  
  const [downloadedCourses, setDownloadedCourses] = useLocalStorage<Record<string, boolean>>("downloaded-courses", {});
  const [activeChapterId, setActiveChapterId] = useState(course?.chapters[0]?.id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const isDownloaded = downloadedCourses[courseId || ""] || false;

  if (!course) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Cours introuvable</h1>
          <Link href="/cours">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const activeChapter = course.chapters.find(c => c.id === activeChapterId) || course.chapters[0];

  const handleDownload = () => {
    if (!courseId) return;
    if (isDownloaded) {
      const newDownloads = { ...downloadedCourses };
      delete newDownloads[courseId];
      setDownloadedCourses(newDownloads);
      toast.success("Cours retiré du mode hors-ligne");
    } else {
      setDownloadedCourses({ ...downloadedCourses, [courseId]: true });
      toast.success("Cours téléchargé pour une lecture hors-ligne !");
    }
  };

  const handleAnswer = (exerciseIdx: number, optionIdx: number) => {
    if (submitted[activeChapter.id]) return;
    setAnswers({ ...answers, [`${activeChapter.id}-${exerciseIdx}`]: optionIdx });
  };

  const handleVerify = () => {
    setSubmitted({ ...submitted, [activeChapter.id]: true });
    toast.success("Exercices corrigés !");
  };

  return (
    <Layout>
      {/* Course Header */}
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <Link href="/cours" className="inline-flex items-center text-primary-foreground/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au catalogue
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-2xl space-y-4">
              <div className="flex gap-3">
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                  {course.subject}
                </span>
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight">{course.title}</h1>
              <p className="text-primary-foreground/80 text-lg">{course.description}</p>
            </div>
            <Button 
              onClick={handleDownload}
              variant={isDownloaded ? "outline" : "secondary"} 
              className={isDownloaded ? "bg-green-500/20 text-white border-green-400 hover:bg-green-500/30" : "font-bold"}
            >
              {isDownloaded ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Disponible hors-ligne</>
              ) : (
                <><DownloadCloud className="mr-2 h-4 w-4" /> Télécharger (Hors-ligne)</>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chapter Navigation */}
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-4">
            <h3 className="font-bold text-lg mb-4">Contenu du cours</h3>
            <div className="flex flex-col space-y-2">
              {course.chapters.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapterId(chapter.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    activeChapterId === chapter.id 
                      ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20" 
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 ${
                      activeChapterId === chapter.id ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`font-medium ${activeChapterId === chapter.id ? "text-primary" : "text-foreground"}`}>
                      {chapter.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Content */}
          <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8">
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
              {/* Video Placeholder */}
              <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-8 relative overflow-hidden group cursor-pointer">
                <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-white group-hover:scale-110 transition-all mb-4" />
                <p className="font-medium text-white/80">Vidéo de la leçon : {activeChapter.title}</p>
                {isDownloaded && <span className="absolute top-4 right-4 text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">Stocké localement</span>}
              </div>
              
              {/* Written Summary */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 font-bold text-lg text-primary border-b pb-4">
                  <BookText className="w-5 h-5" />
                  <h3>Résumé de la leçon</h3>
                </div>
                <div className="prose max-w-none text-foreground/80">
                  <p className="text-lg leading-relaxed">{activeChapter.summary}</p>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-2 font-bold text-lg text-primary border-b pb-4">
                <PenTool className="w-5 h-5" />
                <h3>Exercices d'application</h3>
              </div>

              <div className="space-y-8">
                {activeChapter.exercises.map((ex, eIdx) => {
                  const ansKey = `${activeChapter.id}-${eIdx}`;
                  const selectedOpt = answers[ansKey];
                  const isSubmitted = submitted[activeChapter.id];
                  const isCorrect = selectedOpt === ex.answer;

                  return (
                    <div key={eIdx} className="space-y-4">
                      <p className="font-medium text-lg">{eIdx + 1}. {ex.question}</p>
                      <div className="grid gap-3">
                        {ex.options.map((opt, oIdx) => {
                          let btnClass = "justify-start h-auto py-3 px-4 text-left font-normal border-2 bg-transparent";
                          let icon = null;

                          if (isSubmitted) {
                            if (oIdx === ex.answer) {
                              btnClass = "justify-start h-auto py-3 px-4 text-left font-bold border-green-500 bg-green-50 text-green-900";
                              icon = <Check className="w-5 h-5 text-green-600 ml-auto shrink-0" />;
                            } else if (selectedOpt === oIdx) {
                              btnClass = "justify-start h-auto py-3 px-4 text-left font-normal border-red-500 bg-red-50 text-red-900 opacity-70";
                              icon = <X className="w-5 h-5 text-red-600 ml-auto shrink-0" />;
                            } else {
                              btnClass = "justify-start h-auto py-3 px-4 text-left font-normal border-muted bg-transparent opacity-50";
                            }
                          } else {
                            if (selectedOpt === oIdx) {
                              btnClass = "justify-start h-auto py-3 px-4 text-left font-bold border-primary bg-primary/5 text-primary";
                            } else {
                              btnClass = "justify-start h-auto py-3 px-4 text-left font-normal hover:bg-muted";
                            }
                          }

                          return (
                            <Button 
                              key={oIdx} 
                              variant="outline" 
                              className={btnClass}
                              onClick={() => handleAnswer(eIdx, oIdx)}
                              disabled={isSubmitted}
                            >
                              <div className="flex items-center w-full">
                                <span className="mr-3 w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 bg-background">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {icon}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!submitted[activeChapter.id] && Object.keys(answers).filter(k => k.startsWith(activeChapter.id)).length > 0 && (
                <div className="pt-6 border-t mt-8">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleVerify}>
                    Vérifier mes réponses
                  </Button>
                </div>
              )}

              {submitted[activeChapter.id] && (
                <div className="pt-6 border-t mt-8 flex flex-col sm:flex-row gap-4 items-center bg-muted/30 p-6 rounded-xl">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Excellent travail !</p>
                    <p className="text-muted-foreground text-sm">Tu as terminé cette leçon. Prêt pour la suite ?</p>
                  </div>
                  {course.chapters.length > 1 && (
                    <Button variant="secondary">Chapitre Suivant <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}