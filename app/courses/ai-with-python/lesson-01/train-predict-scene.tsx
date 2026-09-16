/* oxlint-disable next/no-img-element -- Original generated course illustration. */
'use client';

import { Stage, asset } from './lesson-ui';
import s from './train-predict-scene.module.css';

export function TrainPredictScene() {
  return (
    <Stage
      label="MACHINE LEARNING · 训练与预测"
      title="机器学习过程详解——先训练，再预测"
    >
      <figure className={s.diagram}>
        <img
          src={asset('train-predict-cats-dogs.png')}
          alt="左侧是训练：把多张猫和狗的图片连同正确答案交给电脑，电脑从例子中学习规律，得到模型。右侧是预测：把一张新的白色小狗图片交给训练好的同一个模型，不提供答案，模型给出‘狗’的预测。训练得到模型，预测使用模型。"
          width={1774}
          height={887}
        />
        <figcaption>以识别猫和狗为例</figcaption>
      </figure>
    </Stage>
  );
}
