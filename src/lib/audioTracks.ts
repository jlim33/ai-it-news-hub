export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: "classical" | "lofi" | "meditation" | "nature";
  categoryLabel: string;
  src: string;
  duration?: string;
  icon?: string;
}

export const AI_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "classic-canon",
    title: "Pachelbel - Canon in D major (파헬벨 캐논 변주곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 명작 🎻",
    src: "/audio/classic-best/01-pachelbel-canon.mp3",
    duration: "6:23",
  },
  {
    id: "classic-fur-elise",
    title: "Beethoven - Für Elise (베토벤 엘리제를 위하여)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 피아노 🎹",
    src: "/audio/classic-best/02-beethoven-fur-elise.mp3",
    duration: "3:49",
  },
  {
    id: "classic-winter",
    title: "Vivaldi - Four Seasons 'Winter' 1st Mvt (비발디 사계 '겨울' 1악장)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 현악 🎻",
    src: "/audio/classic-best/03-vivaldi-winter-1st.mp3",
    duration: "3:44",
  },
  {
    id: "classic-liebesfreud",
    title: "Kreisler - Liebesfreud (크라이슬러 사랑의 기쁨)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 바이올린 🎻",
    src: "/audio/classic-best/04-kreisler-liebesfreud.mp3",
    duration: "3:32",
  },
  {
    id: "classic-thais",
    title: "Massenet - Méditation from Thaïs (마스네 타이스의 명상곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 명상 🎻",
    src: "/audio/classic-best/05-massenet-meditation-thais.mp3",
    duration: "5:01",
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
  },
];
