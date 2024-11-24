"use client";

// Previous imports remain the same...

export function MemoryView({ id }: MemoryViewProps) {
  // Previous state and effects remain the same...

  if (isLoading || !memoryData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-px h-16 bg-white/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-24">
      <article className="prose prose-invert mx-auto">
        <div className="space-y-8 mb-16">
          <div className="space-y-4">
            <p className="text-sm tracking-widest text-white/50">
              {new Date().toLocaleDateString()}
            </p>
            <h1 className="text-4xl font-light tracking-tight leading-tight">
              {memoryData.summary}
            </h1>
            <p className="text-white/50">
              by {memoryData.author.username}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <p className="text-lg leading-relaxed">{memoryData.content}</p>

          {images.map((image, index) => (
            <figure key={index} className="my-12">
              <div className="aspect-[3/2] relative">
                <Image
                  src={image.url}
                  alt={image.summary || "Memory image"}
                  fill
                  className="object-cover grayscale"
                />
              </div>
              {image.summary && (
                <figcaption className="mt-2 text-sm text-white/50 text-center">
                  {image.summary}
                </figcaption>
              )}
            </figure>
          ))}

          {songs.length > 0 && (
            <div className="border-t border-white/10 pt-8">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/50 text-sm"
                >
                  <Music2 className="w-4 h-4" />
                  <span>{song.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}