<template>
    <button class="dynamic_button" :class="{
        '_outlined': buttonConfig.outlined,
        '_disabled': buttonConfig.disabled,
    }" :style="{
        'background': buttonConfig.customColor?.backgroundColor,
        'padding-inline': buttonConfig.customPadding?.padding_inLine,
        'padding-bottom': buttonConfig.customPadding?.padding_bottom,
        'padding-top': buttonConfig.customPadding?.padding_top,
    }" @click="buttonConfig.handler ? buttonConfig.handler() : false">

        <img v-if="buttonConfig.imgSrc" :src="buttonConfig.imgSrc">
        <span class="label" :style="{ 'color': buttonConfig.customColor?.colorText }"> {{ buttonConfig.label }}
        </span></button>
</template>
<script>
export default {
    name: 'DynamicButton',

    props: ['buttonConfig']
}
</script>
<style>
.dynamic_button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0px;
    color: #ffffff;

    @media screen and (max-width: 500px) {
        font-size: 14px;
    }
}

._disabled {
    background: #cccccc !important;
}

._outlined {
    border: 2px solid #508ff4;
    color: #0090ff;
    background-color: #fff;

    &:hover {
        color: #fff;
        background: #0090ff;
        border: 2px solid #0090ff;
    }
}
</style>