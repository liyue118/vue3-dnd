# Vue3 Dn<img src="http://image.haochenguang.cn/pictures/vue3-dnd.svg" width="28">

[website](https://hcg1023.github.io/vue3-dnd/) |
[中文官网](https://haochenguang.gitee.io/vue3-dnd/)

React Dnd implementation in Vue Composition-api.

**Supports Vue2 and Vue3**

If you think this project is helpful to you, I hope you can contribute a [star⭐](https://github.com/hcg1023/vue3-dnd)

[![npm version](https://img.shields.io/npm/v/vue3-dnd.svg?style=flat-square)](https://www.npmjs.com/package/vue3-dnd)
[![CI](https://github.com/hcg1023/vue3-dnd/actions/workflows/ci.yml/badge.svg)](https://github.com/hcg1023/vue3-dnd/actions/workflows/ci.yml)
[![GitHub open issues](https://img.shields.io/github/issues/hcg1023/vue3-dnd.svg)](https://github.com/hcg1023/vue3-dnd/issues?q=is%3Aopen+is%3Aissue)
[![GitHub Stars](https://img.shields.io/github/stars/hcg1023/vue3-dnd.svg)](https://github.com/hcg1023/vue3-dnd/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/hcg1023/vue3-dnd)](https://github.com/hcg1023/vue3-dnd/network/members)
[![GitHub PR](https://img.shields.io/github/issues-pr/hcg1023/vue3-dnd)](https://github.com/hcg1023/vue3-dnd/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/hcg1023/vue3-dnd?color=2b9348)](https://github.com/hcg1023/vue3-dnd/graphs/contributors)
[![npm download](https://img.shields.io/npm/dt/vue3-dnd.svg?maxAge=30)](https://www.npmjs.com/package/vue3-dnd)
[![npm download per month](https://img.shields.io/npm/dm/vue3-dnd.svg?style=flat-square)](https://www.npmjs.com/package/vue3-dnd)
[![Featured on Openbase](https://badges.openbase.com/js/featured/vue3-dnd.svg?token=DweDwkc7YaNcSSwPw5ToxjJyG/CPuAX7J7sZFXKUg9c=)](https://openbase.com/js/vue3-dnd?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge)
[![MIT License](https://img.shields.io/github/license/hcg1023/vue3-dnd.svg)](https://github.com/hcg1023/vue3-dnd/blob/main/LICENSE)

**[中文](https://github.com/hcg1023/vue3-dnd/blob/main/packages/vue3-dnd/README_ZH.md)** | **[English](README.md)**

## Using
```
npm install vue3-dnd
yarn add vue3-dnd
pnpm install vue3-dnd
```
```vue
// App.vue
<script>
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Home from './Home.vue'
</script>

<template>
    <DndProvider :backend="HTML5Backend">
        <Home></Home>
    </DndProvider>
</template>
// Home.vue
<script>
import { useDrag, useDrop, useDragLayer } from 'vue3-dnd'
// Write your own code
</script>
```

## Notice
1. **Because of composition-API limitations, please do not attempt to deconstruct assignment for the collect parameter from hooks such as useDrag and useDrop, otherwise it will lose its responsiveness, Such as:**

    ```ts
    import { useDrag } from 'vue3-dnd'
    import { toRefs } from '@vueuse/core'
    
    const [collect, drag] = useDrag(() => ({
        type: props.type,
        item: {name: props.name},
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
        }),
    }))
    
    // good
    const opacity = computed(() => unref(collect).opacity)
    // using vueuse toRefs api
    const { opacity } = toRefs(collect)
    // bad
    const { opacity } = collect.value
    ```

2. **The drag drop dragPreview ref is a function, using template please using `v-bind:ref="drag"`, You can also set the value to it using a new function**
```vue
<template>
  <div :ref="drag">box</div>
  <div :ref="setDrop">drop div
    <section>
      drop section
    </section>
  </div>
</template>
<script lang="ts" setup>
import { useDrag, useDrop } from 'vue3-dnd'

const [, drag] = useDrag(() => ({
	type: 'Box',
}))
const [, drop] = useDrop(() => ({
  type: 'Box'
}))

// You can also set the value to it using a new function
const setDrop = (el: HTMLDivElement | null) => {
	drop(el)
    // or
	drop(el?.querySelector('section') || null)
}


</script>
```

## example
### App.vue
```vue
<script setup lang="ts">
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Example from './Example.vue'
</script>

<template>
    <DndProvider :backend="HTML5Backend">
        <Example></Example>
    </DndProvider>
</template>

```
#### Example.vue
```vue
<script lang="ts" setup>
import { useDrag, useDrop } from 'vue3-dnd'
import { computed, unref } from 'vue'

const [dropCollect, drop] = useDrop(() => ({
	accept: 'Box',
	drop: () => ({ name: 'Dustbin' }),
	collect: monitor => ({
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}),
}))
const canDrop = computed(() => unref(dropCollect).canDrop)
const isOver = computed(() => unref(dropCollect).isOver)
const isActive = computed(() => unref(canDrop) && unref(isOver))
const backgroundColor = computed(() =>
	unref(isActive) ? 'darkgreen' : unref(canDrop) ? 'darkkhaki' : '#222'
)

const [collect, drag] = useDrag(() => ({
	type: 'Box',
	item: () => ({
		name: 'Box',
	}),
	end: (item, monitor) => {
		const dropResult = monitor.getDropResult<{ name: string }>()
		if (item && dropResult) {
			alert(`You dropped ${item.name} into ${dropResult.name}!`)
		}
	},
	collect: monitor => ({
		isDragging: monitor.isDragging(),
		handlerId: monitor.getHandlerId(),
	}),
}))
const isDragging = computed(() => collect.value.isDragging)

const opacity = computed(() => (unref(isDragging) ? 0.4 : 1))
</script>

<template>
    <div>
        <div :style="{ overflow: 'hidden', clear: 'both' }">
            <div
                :ref="drop"
                role="Dustbin"
                class="drop-container"
                :style="{ backgroundColor }"
            >
                {{ isActive ? 'Release to drop' : 'Drag a box here' }}
            </div>
        </div>
        <div :style="{ overflow: 'hidden', clear: 'both' }">
            <div :ref="drag" class="box" role="Box" :style="{ opacity }">Box</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.drop-container {
    height: 12rem;
    width: 12rem;
    margin-right: 1.5rem;
    margin-bottom: 1.5rem;
    color: white;
    padding: 1rem;
    text-align: center;
    font-size: 1rem;
    line-height: normal;
    float: left;
}
.box {
    border: 1px solid gray;
    background-color: white;
    padding: 0.5rem 1rem;
    margin-right: 1.5rem;
    margin-bottom: 1.5rem;
    cursor: move;
    float: left;

    &.dragging {
        opacity: 0.4;
    }
}
</style>
```

## Q/A
### Q: The data does not change during or after the drag is complete

A: Check if your spec or item is a function, If your item is a static object, you really don't get reactive data changes during drag and drop

```ts
// The following situations may result in don't have reactive
const [collect, connectDrag] = useDrag({
	type: 'box',
	item: { id: props.id },
})
// The correct way to write it
const [collect, connectDrag] = useDrag({
	type: 'box',
	item: () => ({ id: props.id }),
})
const [collect, connectDrag] = useDrag(() => ({
	type: 'box',
	item:  { id: props.id },
}))
```

## Contributors
<a href="https://github.com/hcg1023/vue3-dnd/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hcg1023/vue3-dnd" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Thanks

[React-Dnd](https://github.com/react-dnd/react-dnd)
