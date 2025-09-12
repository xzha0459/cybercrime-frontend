<template>
  <div class="explore-library-section">
    <div class="section-container">
      <div class="card-content">
        <div class="section-header">
          <h2 class="card-title">Cybersecurity Library</h2>
        </div>

        <!-- Featured Video Carousel -->
        <div class="featured-video" v-if="videos.length">
          <div class="video-content">
            <div class="content-info">
              <h3 class="video-title">{{ videos[currentIndex].title }}</h3>
              <div class="video-description">
                <span>Video by: {{ videos[currentIndex].author }}</span><br />
                <span>Published date: {{ videos[currentIndex].publish_date }}</span>
              </div>
              <div class="video-meta">
                <span class="video-type">Video</span>
                <span class="video-duration">{{ videos[currentIndex].suggested_reading_time }} min</span>
              </div>
            </div>

            <div class="video-preview">
              <YoutubePlayer
                v-if="videos.length && videos[currentIndex] && extractYouTubeId(videos[currentIndex].link)"
                :key="videos[currentIndex].id"
                :videoId="extractYouTubeId(videos[currentIndex].link)"
                :videoKey="videos[currentIndex].id"
                @save-progress="handleSaveProgress"
                @video-ended="handleVideoEnded"
              />
              <div v-else class="video-placeholder">
                <p>Loading video...</p>
              </div>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button class="nav-arrow nav-prev" @click="prevVideo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="nav-arrow nav-next" @click="nextVideo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="browse-section">
          <router-link to="/library" class="browse-button">
            Browse Content
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import YoutubePlayer from '@/components/YoutubePlayer.vue'

export default {
  name: 'ExploreLibrarySection',
  components: {
    YoutubePlayer,
  },
  setup() {
    const videos = ref([])
    const currentIndex = ref(0)

    const fetchVideos = async () => {
      try {
        const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/')
        const data = await res.json()
        videos.value = data.slice(0, 3) // 只取前3个视频用于轮播
        console.log('Fetched videos:', videos.value)
      } catch (err) {
        console.error('Error fetching videos:', err)
      }
    }

    const extractYouTubeId = (url) => {
      if (!url) {
        console.log('No URL provided')
        return null
      }
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
      const match = url.match(regex)
      const videoId = match ? match[1] : null
      console.log('Extracting YouTube ID from:', url, 'Result:', videoId)
      return videoId
    }

    const handleSaveProgress = () => {
      // Handle save progress functionality
    }

    const handleVideoEnded = () => {
      // Handle video ended event
    }

    const nextVideo = () => {
      currentIndex.value = (currentIndex.value + 1) % videos.value.length
    }

    const prevVideo = () => {
      currentIndex.value = (currentIndex.value - 1 + videos.value.length) % videos.value.length
    }

    onMounted(fetchVideos)

    return {
      videos,
      currentIndex,
      extractYouTubeId,
      handleSaveProgress,
      handleVideoEnded,
      nextVideo,
      prevVideo,
    }
  },
}
</script>

<style scoped>
.explore-library-section {
  padding: 2rem 0;
  background: var(--violet-light);
  min-height: 40vh;
  display: flex;
  align-items: center;
}

.section-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 30px;
}

.section-header {
  text-align: center;
}

.browse-section {
  display: flex;
  justify-content: center;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--violet-dark);
  margin: 0;
  line-height: 1.2;
}


.browse-button {
  display: inline-block;
  background: var(--violet-dark);
  color: var(--text-light);
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.browse-button:hover {
  background: var(--violet-medium);
  color: var(--text-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Featured Video Carousel */
.featured-video {
  position: relative;
  max-width: 1000px;
  margin: 0 auto 0.4rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-light);
  overflow: visible;
}

.video-content {
  display: flex;
  height: 420px;
  overflow: hidden;
}

.content-info {
  flex: 0.4;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.video-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.video-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.video-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.video-type {
  background: var(--violet-deep);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.video-duration {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.video-preview {
  flex: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border-radius: 0;
  overflow: visible;
  width: 100%;
  height: 100%;
  position: relative;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--violet-light);
  border-radius: 8px;
  color: var(--violet-medium);
  font-size: 1rem;
}

/* YouTube Player Styles */
.iframe-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.youtube-embed-wrapper {
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* Navigation Arrows - Updated Modern Style */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: white;
  border: 2px solid var(--violet-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--violet-dark);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.nav-arrow:hover {
  background: var(--violet-dark);
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.nav-arrow svg {
  width: 24px;
  height: 24px;
}

.nav-prev {
  left: -25px;
}

.nav-next {
  right: -25px;
}

@media (max-width: 768px) {
  .explore-library-section {
    padding: 1rem 0;
    min-height: 40vh;
  }

  .section-container {
    padding: 0 15px;
  }

  .card-content {
    gap: 20px;
  }

  .card-title {
    font-size: 1.6rem;
  }


  .video-content {
    display: flex;
    flex-direction: column;
    height: auto;
    overflow: visible;
  }

  .content-info {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .video-preview {
    height: 200px;
    margin-top: 1rem;
  }

  .video-meta,
  .video-description {
    font-size: 0.85rem;
    line-height: 1.2;
  }

  .video-title {
    font-size: 1.1rem;
    line-height: 1.3;
    word-break: break-word;
    hyphens: auto;
  }

  .iframe-container {
    height: 100%;
  }

  .video-placeholder {
    height: 100%;
  }

  /* Mobile arrows positioning */
  .nav-arrow {
    width: 40px;
    height: 40px;
    border-width: 1px;
  }

  .nav-arrow svg {
    width: 20px;
    height: 20px;
  }

  .nav-prev {
    left: -20px;
  }

  .nav-next {
    right: -20px;
  }

  .browse-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 0 10px;
  }

  .card-title {
    font-size: 1.4rem;
  }

}
</style>
