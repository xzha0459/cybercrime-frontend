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

       <!-- Featured Articles Grid -->
        <div class="article-grid" v-if="articles.length && (selectedContentType === 'all' || selectedContentType === 'articles')">
          <a
            v-for="article in displayedArticles"
            :key="article.id"
            :href="article.link"
            target="_blank"
            rel="noopener noreferrer"
            class="article-card"
          >
            <div class="article-thumbnail">
              <img
                :src="getArticleThumbnail(article)"
                :alt="article.title"
                class="thumbnail-image"
                @error="onImageError"
              />


              <div class="duration-badge">{{ article.suggested_reading_time }} min</div>
            </div>

            <div class="article-info">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-description">
                <span>By: {{ article.author || 'Unknown' }}</span><br />
                <span>Published: {{ article.publish_date }}</span>
              </div>
              <div class="article-meta">
                <span class="article-type">Article</span>
                <span class="article-duration">{{ article.suggested_reading_time }} min</span>
              </div>
            </div>
          </a>
        </div>

      <!-- View More Articles Button -->
      <div class="view-more-section" v-if="selectedContentType === 'articles' || selectedContentType === 'all'">
        <button class="view-more-btn" @click="showAllArticles = !showAllArticles">
          <span>{{ showAllArticles ? 'Show Less Articles' : 'View More Articles' }}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :class="{ 'rotated': showAllArticles }">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>


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

      <!-- Featured Videos Grid (Six Videos in 2x3 Grid) -->
      <div class="featured-videos-grid" v-if="videos.length && (selectedContentType === 'all' || selectedContentType === 'videos')">
        <div
          v-for="video in displayedVideos"
          :key="video.id"
          class="video-card"
          @click="loadVideo(video.id)"
        >
          <div class="video-thumbnail">
            <img :src="getYouTubeThumbnail(video.link)" :alt="video.title" class="thumbnail-image" />
            <div class="play-overlay">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="duration-badge">{{ video.suggested_reading_time }} min</div>
          </div>

          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-description">
              <span>Video by: {{ video.author }}</span><br />
              <span>Published date: {{ video.publish_date }}</span>
            </div>
            <div class="video-meta">
              <span class="video-type">Video</span>
              <span class="video-duration">{{ video.suggested_reading_time }} min</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View More Videos Button -->
      <div class="view-more-section" v-if="selectedContentType === 'videos' || selectedContentType === 'all'">
        <button class="view-more-btn" @click="showAllVideos = !showAllVideos">
          <span>{{ showAllVideos ? 'Show Less Videos' : 'View More Videos' }}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :class="{ 'rotated': showAllVideos }">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

    </div>


  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import placeholderImage from '@/assets/placeholder.jpg'

const router = useRouter()

const videos = ref([])
const showAllVideos = ref(false)
const showAllArticles = ref(false)
const articles = ref([])

const fetchArticles = async () => {
  try {
    const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/articles/')
    const data = await res.json()
    articles.value = data
  } catch (err) {
    console.error('Error fetching articles:', err)
  }
}

const displayedVideos = computed(() => {
  return showAllVideos.value ? videos.value : videos.value.slice(0, 6)
})

const displayedArticles = computed(() => {
  return showAllArticles.value ? articles.value : articles.value.slice(0, 6)
})


const loadArticle = (id) => {
  router.push(`/article/${id}`)
}

const getArticleThumbnail = (article) => {
  const thumb = article.thumbnail_url?.trim()

  // Use backend thumbnail if it looks valid
  if (thumb && !thumb.startsWith('data:image/svg+xml')) {
    return thumb
  }

  // Fallbacks by category
  const category = article.category?.toLowerCase() || ''
  if (category.includes('privacy')) {
    return '/images/privacy-default.jpg'
  } else if (category.includes('scam')) {
    return '/images/scam-default.jpg'
  } else if (category.includes('harassment')) {
    return '/images/harassment-default.jpg'
  }

  // Generic fallback
  return placeholderImage
}


// const currentVideo = computed(() => videos.value[currentIndex.value] || {})

const selectedContentType = ref('all')
const selectedDuration = ref('all')

const applyDurationFilter = async (duration) => {
  selectedDuration.value = duration
  await fetchFilteredVideos()
  if (selectedContentType.value === 'articles' || selectedContentType.value === 'all') {
    await fetchFilteredArticles()
  }
}


const applyContentTypeFilter = async (type) => {
  selectedContentType.value = type
  await fetchFilteredVideos()
  if (selectedContentType.value === 'articles' || selectedContentType.value === 'all') {
    await fetchFilteredArticles()
  }
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
  } catch (err) {
    console.error('Error fetching videos:', err)
  }
}

const fetchFilteredArticles = async () => {
  let url = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/articles/'
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
    url = `https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/articles/filter/?${params.toString()}`
  }

  try {
    const res = await fetch(url)
    const data = await res.json()
    articles.value = data
  } catch (err) {
    console.error('Error fetching articles:', err)
  }
}

const fetchVideos = async () => {
  try {
    const res = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/')
    const data = await res.json()
    videos.value = data // 存储所有视频
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
  // 导航到新的视频页面
  router.push(`/video/${id}`)
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


onMounted(async () => {
  await fetchVideos()
  await fetchArticles()

})
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
  background: var(--violet-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.view-more-btn:hover {
  background: var(--violet-ultra-dark);
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
  border-color: var(--violet-dark);
  color: var(--violet-dark);
}

.filter-btn.active {
  background: var(--violet-dark);
  color: white;
  border-color: var(--violet-dark);
}


/* Featured Videos Grid */
.featured-videos-grid, .article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 3rem auto;
}

.video-card, .article-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-light);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.video-card:hover, .article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail, .article-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
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

.video-card:hover .play-overlay {
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

.video-info, .article-info{
  padding: 1.5rem;
}

.video-title, .article-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-description, .article-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.video-meta, .article-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.video-type, .article-type {
  background: var(--violet-deep);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.video-duration, .article-duration {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}





.video-type, .article-type {
  background: var(--violet-deep);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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


  /* Featured Videos Grid Responsive */
  .featured-videos-grid, .article-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 0 auto 2rem auto;
  }

  .video-thumbnail, .article-thumbnail {
    height: 180px;
  }

  .video-info, .article-info {
    padding: 1.25rem;
  }

  .video-meta,
  .video-description, .article-description, .article-meta {
    font-size: 0.85rem;
    line-height: 1.2;
  }

  .video-title, .article-title {
    font-size: 0.9rem;
    line-height: 1.3;
    word-break: break-word;
    hyphens: auto;
  }

}

/* View More Button Animation */
.view-more-btn svg.rotated {
  transform: rotate(180deg);
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

  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }


  .card-thumbnail {
    height: 200px;
  }
}
</style>
