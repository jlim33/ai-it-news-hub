export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: "lofi" | "classical" | "meditation" | "nature";
  categoryLabel: string;
  src: string;
  duration?: string;
  icon?: string;
}

export const AI_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "ai-coding-lofi",
    title: "Chopin - Nocturne in E-flat major, Op. 9 No. 2",
    artist: "Cyber Piano Chillout",
    category: "classical",
    categoryLabel: "클래식 피아노 🎹",
    src: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=chopin-nocturne-op-9-no-2-110829.mp3",
    duration: "4:32",
  },
  {
    id: "ai-paris-chanson",
    title: "Breeze of Paris (Acoustic Chanson Cafe)",
    artist: "Silicon Valley Cafe Lounge",
    category: "lofi",
    categoryLabel: "파리지앵 샹송 ☕",
    src: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=french-accordion-chanson-122941.mp3",
    duration: "3:10",
  },
  {
    id: "ai-bach-chamber",
    title: "Bach - Air on the G String",
    artist: "Chamber Strings Orchestra",
    category: "classical",
    categoryLabel: "클래식 현악 🎻",
    src: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_341bbec7bb.mp3?filename=bach-air-on-the-g-string-orchestral-suite-no-3-in-d-major-bwv-1068-105151.mp3",
    duration: "4:15",
  },
  {
    id: "ai-528hz-deepwork",
    title: "528Hz Deep Work & Cognitive Focus",
    artist: "Solfeggio Frequency Project",
    category: "meditation",
    categoryLabel: "528Hz 딥포커스 🧘",
    src: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97693998b.mp3?filename=528hz-healing-meditation-125867.mp3",
    duration: "5:00",
  },
  {
    id: "ai-rain-cyber",
    title: "Healing Forest Rain & Gentle Stream",
    artist: "Nature Acoustics Bio-Lab",
    category: "nature",
    categoryLabel: "숲속 빗소리 🌧️",
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-rain-ambient-111154.mp3",
    duration: "6:10",
  },
  {
    id: "ai-ocean-waves",
    title: "Peaceful Pacific Ocean Waves",
    artist: "Coastal Calming Sound",
    category: "nature",
    categoryLabel: "온화한 파도소리 🌊",
    src: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_82315b9468.mp3?filename=ocean-waves-ambient-8247.mp3",
    duration: "5:30",
  }
];
