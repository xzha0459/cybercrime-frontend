<template>
  <section class="resource-section">
    <div class="section-header">
      <h2 class="section-title">Learning Resources</h2>
      <p class="section-description">
        Access 3-5 minute cybersecurity videos and articles perfect for learning during breaks between classes
      </p>
    </div>

    <div class="section-content">
      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">Content Type:</label>
          <div class="filter-buttons">
            <button class="filter-btn active">All</button>
            <button class="filter-btn">Videos</button>
            <button class="filter-btn">Articles</button>
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-label">Duration:</label>
          <div class="filter-buttons">
            <button class="filter-btn active">All</button>
            <button class="filter-btn">Under 3 min</button>
            <button class="filter-btn">3-5 min</button>
          </div>
        </div>
      </div>

      <!-- Featured Article Carousel -->
      <div class="featured-article">
        <div class="article-content">
          <div class="content-info">
            <h3 class="article-title">Social Media Privacy Guide</h3>
            <p class="article-description">Essential tips to protect your privacy on social media platforms. Learn how to secure your accounts, control your data sharing, and avoid common privacy pitfalls that could compromise your personal information.</p>
            <div class="article-meta">
              <span class="article-type">Article</span>
              <span class="article-duration">3 min read</span>
            </div>
            <button class="view-btn">View</button>
          </div>
          <div class="article-cover">
            <div class="cover-image">
              <div class="cover-icon">📱</div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows - Updated Style -->
        <button class="nav-arrow nav-prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-arrow nav-next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

        <!-- Featured Video Carousel (Single Visible Video with Arrows) -->
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
              <iframe
                :src="`https://www.youtube.com/embed/${extractYouTubeId(videos[currentIndex].link)}?rel=0`"
                frameborder="0"
                allowfullscreen
                class="youtube-embed-wrapper"
              ></iframe>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            class="nav-arrow nav-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10"
            @click="prevVideo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="nav-arrow nav-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10"
            @click="nextVideo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import YouTubePlayer from '@/components/YoutubePlayer.vue'

const videos = ref([])
const currentIndex = ref(0)
const playVideo = ref(false)

const currentVideo = computed(() => videos.value[currentIndex.value] || {})

const fetchVideos = async () => {
  try {
    const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/')
    const data = await res.json()
    videos.value = data
  } catch (err) {
    console.error('Error fetching videos:', err)
  }
}

const extractYouTubeId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

const getYouTubeThumbnail = (url) => {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

const nextVideo = () => {
  currentIndex.value = (currentIndex.value + 1) % videos.value.length
  playVideo.value = false
}

const prevVideo = () => {
  currentIndex.value = (currentIndex.value - 1 + videos.value.length) % videos.value.length
  playVideo.value = false
}

onMounted(fetchVideos)
</script>

<style scoped>

.resource-section {
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
}

/* Filter Controls */
.filter-controls {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-size: 1.125rem;
  color: var(--text-primary);
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.625rem 1.25rem;
  background: var(--bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--forest-medium);
  color: var(--forest-medium);
}

.filter-btn.active {
  background: var(--forest-medium);
  color: white;
  border-color: var(--forest-medium);
}

/* Featured Article Carousel */
.featured-article {
  position: relative;
  max-width: 1000px;
  margin: 0 auto 3rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-light);
  overflow: visible;
}

.article-content {
  display: flex;
  min-height: 400px;
}

.content-info {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.article-type {
  background: var(--forest-medium);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.article-duration {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.view-btn {
  align-self: flex-start;
  padding: 0.75rem 2rem;
  background: var(--forest-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-medium);
}

.view-btn:hover {
  background: var(--forest-deep);
}

.article-cover {
  flex: 1;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-image {
  width: 80%;
  height: 80%;
  background: var(--forest-medium);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-icon {
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Featured Video Carousel */
.featured-video {
  position: relative;
  max-width: 1000px;
  margin: 0 auto 3rem auto;
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
  background: var(--forest-deep);
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

.play-btn {
  align-self: flex-start;
  padding: 0.75rem 2rem;
  background: var(--forest-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-medium);
}

.play-btn:hover {
  background: var(--forest-deep);
}

.video-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  height: auto;
}

.preview-image {
  width: 80%;
  height: 80%;
  background: var(--forest-medium);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.play-icon {
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.duration-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Navigation Arrows - Updated Modern Style */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: white;
  border: 2px solid var(--forest-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--forest-medium);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.nav-arrow:hover {
  background: var(--forest-medium);
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

.youtube-embed-wrapper {
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-image {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
}


/* Active state for arrows */
.nav-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

/* Focus state for accessibility */
.nav-arrow:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 154, 139, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .resource-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .filter-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .filter-btn {
    width: 100%;
    text-align: center;
  }

  .article-content,
  .video-content {
    flex-direction: column;
    min-height: unset;
  }
  .content-info {
    padding: 2rem;
  }

  .article-cover {
    min-height: 250px;
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
}
</style>
