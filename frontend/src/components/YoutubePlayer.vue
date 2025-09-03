<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { YouTube } from 'vue3-youtube'

const props = defineProps({
  videoId: String,      
  videoDbId: String      
})

let player = null
let interval = null

const onReady = (event) => {
  player = event.target
  interval = setInterval(sendProgress, 5000)
}

const onStateChange = (event) => {
  if (event.data === 0) {
    sendProgress(true) // Video completed
  }
}

const sendProgress = async (completed = false) => {
  if (!player || !player.getCurrentTime || !player.getDuration) return

  const currentTime = player.getCurrentTime()
  const duration = player.getDuration()
  if (!duration || duration === 0) return

  const percentage = Math.floor((currentTime / duration) * 100)

  const payload = {
    video_id: props.videoDbId,
    progress: completed ? 100 : percentage
  }

  try {
    await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/videos/progress/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload)
    })
    console.log('Sent video progress:', payload)
  } catch (err) {
    console.error('Failed to send progress:', err)
  }
}

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <iframe
    width="100%"
    height="100%"
    :src="`https://www.youtube.com/embed/${videoId}?rel=0`"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>