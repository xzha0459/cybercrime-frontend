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
        <!-- Content Type Filter -->
        <div class="filter-group">
          <label class="filter-label">Content Type:</label>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: selectedContentType === 'all' }"
              @click="applyContentTypeFilter('all')"
            >All</button>
            <button
              class="filter-btn"
              :class="{ active: selectedContentType === 'videos' }"
              @click="applyContentTypeFilter('videos')"
            >Videos</button>
            <button
              class="filter-btn"
              :class="{ active: selectedContentType === 'articles' }"
              @click="applyContentTypeFilter('articles')"
            >Articles</button>
          </div>
        </div>

        <!-- Duration Filter -->
        <div class="filter-group">
          <label class="filter-label">Duration:</label>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: selectedDuration === 'all' }"
              @click="applyDurationFilter('all')"
            >All</button>
            <button
              class="filter-btn"
              :class="{ active: selectedDuration === 'under3' }"
              @click="applyDurationFilter('under3')"
            >Under 3 min</button>
            <button
              class="filter-btn"
              :class="{ active: selectedDuration === '3to5' }"
              @click="applyDurationFilter('3to5')"
            >3–5 min</button>
            <button
              class="filter-btn"
              :class="{ active: selectedDuration === 'over10' }"
              @click="applyDurationFilter('over10')"
            >10+ min</button>
          </div>
        </div>
      </div>

      <!-- Featured Article Carousel -->
      <!-- <div class="featured-article" v-if="selectedContentType === 'all' || selectedContentType === 'articles'">
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
        </div> -->

        <!-- Navigation Arrows - Updated Style -->
        <!-- <button class="nav-arrow nav-prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-arrow nav-next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div> -->

      <!-- Featured Video Carousel (Single Visible Video with Arrows) -->
      <div class="featured-video" v-if="videos.length && (selectedContentType === 'all' || selectedContentType === 'videos')">
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
              v-if="videos.length"
              :key="videos[currentIndex].id"
              :videoId="extractYouTubeId(videos[currentIndex].link)"
              :videoKey="videos[currentIndex].id"
              @save-progress="handleSaveProgress"
              @video-ended="handleVideoEnded"
            />
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button class="nav-arrow nav-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10" @click="prevVideo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="nav-arrow nav-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10" @click="nextVideo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Related Suggestions -->
        <div v-if="showRecommendations" class="related-content">
          <h2 class="related-content__heading">Recommended for You</h2>

          <div v-if="relatedVideos.length" class="related-content__videos">
            <h3 class="related-content__section-title">Related Videos</h3>
            <ul class="related-content__video-list">
              <li v-for="video in relatedVideos" :key="video.id" class="related-content__video-item">
                <button class="related-content__video-link" @click="loadVideoFromRecommendation(video)">
                  {{ video.title }}
                </button>
                <span class="related-content__video-time">— {{ video.suggested_reading_time }} min</span>
              </li>
            </ul>
          </div>

          <div v-if="relatedQuiz" class="related-content__quiz">
            <h3 class="related-content__section-title">Quick Quiz: {{ relatedQuiz.question_text }}</h3>
            <ul class="related-content__quiz-options">
              <li v-for="option in relatedQuiz.options" :key="option.identifier" class="related-content__quiz-option">
                <label class="related-content__quiz-label">
                  <input
                    type="radio"
                    :name="relatedQuiz.id"
                    :value="option.identifier"
                    class="related-content__quiz-input"
                  />
                  {{ option.identifier }}. {{ option.text }}
                </label>
              </li>
            </ul>
            <details class="related-content__explanation">
              <summary class="related-content__explanation-toggle">Show Explanation</summary>
              <p class="related-content__explanation-text">{{ relatedQuiz.explanation }}</p>
            </details>
          </div>
        </div>
      </div>

      <!-- View More Button -->
      <div class="view-more-section">
        <button class="view-more-btn" @click="showAllContent = true">
          <span>View More</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- All Content Modal -->
    <div v-if="showAllContent" class="modal-overlay" @click="showAllContent = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">All Learning Video Resources</h2>
          <button class="modal-close" @click="showAllContent = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="content-grid">
            <div v-for="video in allVideos" :key="video.id" class="content-card" @click="loadVideo(video.id)">
              <div class="card-thumbnail">
                <img :src="getYouTubeThumbnail(video.link)" :alt="video.title" class="thumbnail-image" />
                <div class="play-overlay">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="duration-badge">{{ video.suggested_reading_time }} min</div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ video.title }}</h3>
                <p class="card-author">by {{ video.author }}</p>
                <p class="card-date">{{ video.publish_date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import YoutubePlayer from '@/components/YoutubePlayer.vue'

const videos = ref([])
const allVideos = ref([])
const currentIndex = ref(0)
const playVideo = ref(false)
const showAllContent = ref(false)
const handleSaveProgress = () => {
  // Handle save progress functionality
}

// const relatedItems = ref([])
// const showRelated = ref(false)

const relatedVideos = ref([])
const relatedQuiz = ref(null)
const showRecommendations = ref(false)


// const currentVideo = computed(() => videos.value[currentIndex.value] || {})

const selectedContentType = ref('all')
const selectedDuration = ref('all')

const applyDurationFilter = async (duration) => {
  selectedDuration.value = duration
  await fetchFilteredVideos()
}

const applyContentTypeFilter = async (type) => {
  selectedContentType.value = type
  await fetchFilteredVideos()
}

const fetchFilteredVideos = async () => {
  let url = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/'
  const params = new URLSearchParams()

  if (selectedDuration.value === 'under3') {
    params.append('min_time', 0)
    params.append('max_time', 2)
  } else if (selectedDuration.value === '3to5') {
    params.append('min_time', 3)
    params.append('max_time', 5)
  } else if (selectedDuration.value === 'over10') {
    params.append('min_time', 10)
  }

  if (selectedDuration.value !== 'all') {
    url = `https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/filter/?${params.toString()}`
  }

  try {
    const res = await fetch(url)
    const data = await res.json()
    videos.value = data
    currentIndex.value = 0
    showRecommendations.value = false
  } catch (err) {
    console.error('Error fetching videos:', err)
  }
}

const fetchVideos = async () => {
  try {
    const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/')
    const data = await res.json()
    videos.value = data
    allVideos.value = data // Store all videos for the modal
  } catch (err) {
    console.error('Error fetching videos:', err)
  }
}

// const fetchAllVideos = async () => {
//   try {
//     const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/')
//     const data = await res.json()
//     allVideos.value = data
//   } catch (err) {
//     console.error('Error fetching all videos:', err)
//   }
// }


const extractYouTubeId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

const getYouTubeThumbnail = (url) => {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

const loadVideo = (id) => {
  const index = videos.value.findIndex(v => v.id === id)
  if (index !== -1) {
    currentIndex.value = index
    showRecommendations.value = false
    relatedVideos.value = []
    relatedQuiz.value = null
    showAllContent.value = false // Close modal when video is loaded
  }
}


const loadVideoFromRecommendation = (video) => {
  const index = videos.value.findIndex(v => v.id === video.id)

  if (index !== -1) {
    currentIndex.value = index
  } else {

    videos.value.push(video)
    currentIndex.value = videos.value.length - 1
  }

  showRecommendations.value = false
}


const nextVideo = () => {
  showRecommendations.value = false
  relatedVideos.value = []
  relatedQuiz.value = null
  currentIndex.value = (currentIndex.value + 1) % videos.value.length
  playVideo.value = false
}


const prevVideo = () => {
  showRecommendations.value = false
  relatedVideos.value = []
  relatedQuiz.value = null
  currentIndex.value = (currentIndex.value - 1 + videos.value.length) % videos.value.length
  playVideo.value = false
}


// const fetchRelatedItems = async (videoId) => {
//   try {
//     const res = await fetch(`https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/${videoId}/related/`)
//     const data = await res.json()
//     relatedItems.value = data
//     showRelated.value = true
//   } catch (err) {
//     console.error("Failed to load related content:", err)
//   }
// }

const handleVideoEnded = (payload) => {
  relatedVideos.value = payload.relatedVideos
  relatedQuiz.value = payload.relatedQuiz
  showRecommendations.value = true
}

onMounted(fetchVideos)
</script>

<style scoped>
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
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* View More Section */
.view-more-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.view-more-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--forest-medium);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.view-more-btn:hover {
  background: var(--forest-dark);
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
  flex: 0.4;
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
  flex: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border-radius: 0;
  overflow: visible;
  width: 100%;
  height: auto;
  aspect-ratio: unset;
  position: relative;
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

/* Related Contents */

.related-content {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.related-content__heading {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.related-content__section-title {
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.related-content__video-list {
  list-style: none;
  padding: 0;
}

.related-content__video-item {
  margin-bottom: 0.5rem;
}

.related-content__video-link {
  color: #0056b3;
  text-decoration: none;
}

.related-content__video-time {
  color: #555;
  font-size: 0.9rem;
}

.related-content__quiz-options {
  list-style: none;
  padding: 0;
}

.related-content__quiz-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.related-content__explanation {
  margin-top: 1rem;
}

.related-content__explanation-toggle {
  cursor: pointer;
  font-weight: bold;
}

.related-content__explanation-text {
  margin-top: 0.5rem;
  color: #444;
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

  .article-content {
    flex-direction: column;
    min-height: unset;
  }

  .video-content {
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: visible;
}

  .video-preview {
  height: auto;
  aspect-ratio: unset;
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

  .video-preview {
    margin-top: 1rem;
  }

  .iframe-container {
    width: 100%;
    height: auto;
    padding-bottom: 56.25%;
    position: relative;
    overflow: hidden;
  }

  .iframe-container iframe,
  .iframe-container .youtube-embed-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    border: none;
  }


  .content-info {
    padding: 1rem;
    font-size: 0.9rem;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-light);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-thumbnail {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.content-card:hover .play-overlay {
  background: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

.duration-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-author {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.card-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Responsive Modal */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
    max-height: calc(95vh - 100px);
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card-thumbnail {
    height: 200px;
  }
}
</style>
