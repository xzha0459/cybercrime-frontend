<template>
  <div class="iframe-container">
    <iframe
      ref="youtubeIframe"
      :src="computedSrc"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="youtube-embed-wrapper"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  videoId: String,
  videoKey: [String, Number]
})

const emit = defineEmits([
  'save-progress',
  'video-ended',
  'show-related-videos'
])

const youtubeIframe = ref(null)
let player = null
let interval = null

const backendStartTime = ref(0)

const computedSrc = computed(() => {
  return `https://www.youtube.com/embed/${props.videoId}?enablejsapi=1&start=${backendStartTime.value}&rel=0`
})

const handleVideoEnd = async () => {
  try {
    const res = await fetch(`https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/${props.videoKey}/related/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch related content: ${res.status}`);
    
    const data = await res.json();

    emit('video-ended', {
      relatedVideos: data.related_videos || [],
      relatedQuiz: data.related_quiz || null
    });
  } catch (err) {
    console.error('Error fetching related content:', err);
  }
};


const setupPlayerPolling = () => {
  interval = setInterval(() => {
    if (player && typeof player.getCurrentTime === 'function') {
      const time = player.getCurrentTime()
      localStorage.setItem(`video-progress-${props.videoKey}`, Math.floor(time))

      fetch(`https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/${props.videoKey}/progress/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress: Math.floor(time) })
      })

      emit('save-progress', { id: props.videoId, time })
    }
  }, 5000)
}

const initYouTubeAPI = () => {
  if (!window.YT || !window.YT.Player) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    window.onYouTubeIframeAPIReady = createPlayer
  } else {
    createPlayer()
  }
}

const onPlayerStateChange = (event) => {
  if (event.data === YT.PlayerState.ENDED) {
    emit('video-ended', props.videoKey)
  }
}

const createPlayer = () => {
  player = new YT.Player(youtubeIframe.value, {
    events: {
      onReady: () => {
        setupPlayerPolling()
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          handleVideoEnd()
        }
      }
    }
  })
}

const fetchBackendProgress = async () => {
  try {
    const res = await fetch(`https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/${props.videoKey}/progress/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const data = await res.json()
      backendStartTime.value = data.progress || 0
    }
  } catch (e) {
    console.error('Failed to fetch video progress:', e)
  }
}

onMounted(() => {
  fetchBackendProgress().then(() => {
    initYouTubeAPI()
  })
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>

.iframe-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.youtube-embed-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 480px) {
  .iframe-container {
    padding-top: 65%; 
  }
}
</style>
