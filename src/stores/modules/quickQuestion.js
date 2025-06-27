import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useQuickQuestionStore = defineStore('quickQuestion', () => {
  const question = ref([
    {
      id: '1',
      text: '贵公司可以寄递哪些物品？',
    },
    {
      id: '2',
      text: '下单时应注意哪些事项？',
    },
    {
      id: '3',
      text: '韩国通关码（通关符）是什么？',
    },
    {
      id: '4',
      text: '如何将包裹拦截退回？',
    },
    {
      id: '5',
      text: '如何进行改地址？',
    },
    {
      id: '6',
      text: '什么是申报价值？',
    },
    {
      id: '7',
      text: '货物清关一般需要多久？',
    },
    {
      id: '8',
      text: '物流一直不更新怎么办？',
    },
    {
      id: '9',
      text: '国际客服直线电话是什么？',
    },
    {
      id: '10',
      text: '如何查询出口时效？',
    },
    {
      id: '11',
      text: '国际快递下单方式？',
    },
    {
      id: '12',
      text: '虚假物流怎么办？',
    },
  ]);
  return {
    question,
  };
});
