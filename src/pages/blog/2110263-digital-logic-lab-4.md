---
layout: "../../layouts/PostLayout.astro"
title: "Digital Logic Lab (2110263) - Lab 4"
date: "2024-09-13"
published: true
description: "สรุปเนื้อหาวิชา Digital Logic Lab (2110263) ภาคเรียนที่ 1 ปีการศึกษา 2567"
author: "RuffLogix"
image:
    url: "../../images/cu-intania/2110263-digital-logic-lab/thumbnail.png"
    alt: "Digital Logic Lab"
tags: ["CU Intania x CP"]
---

ในสัปดาห์นี้จะเป็นการต่อ Half Adder/Full Adder บน Breadboard และใช้ 74HC00N/74HC00P เป็น IC ที่ใช้ในการต่อวงจร

<img src="../../images/cu-intania/2110263-digital-logic-lab/lab-4-74hc00n-74hc00p.jpg" alt="74HC00N/74HC00P" style="max-width: 50%; clear: both; display: block; margin: 0 auto;">

หน้าตาของ 74HC00N/74HC00P

![Full Adder Breadboard](../../../public/images/cu-intania/2110263-digital-logic-lab/lab-4-full-adder-breadboard.jpg)

Full Adder บน Breadboard

## Functionally Complete

เราจะกล่าวว่าเซตของ logic gate ใด ๆ เป็น **functionally complete** ก็ต่อเมื่อเราสามารถสร้างวงจร logic ใด ๆ ได้ด้วย logic gate ที่อยู่ในเซตนั้น ๆ โดยใช้เพียงอย่างเดียว เช่น เซตของ not, and, และ or เป็นต้น

## NAND และ NOR

NAND และ NOR ทั้งคู่เป็น functionally complete ซึ่งหมายความว่าเราสามารถสร้างวงจรใด ๆ ได้ด้วย NAND หรือ NOR เพียงอย่างเดียว

### NAND

![NAND Functionally Complete](../../../public/images/cu-intania/2110263-digital-logic-lab/lab-4-nand-functionally-complete.jpg)

### NOR

![NOR Functionally Complete](../../../public/images/cu-intania/2110263-digital-logic-lab/lab-4-nor-functionally-complete.jpg)

> เนื่องจาก IC ที่เราใช้คือ 74HC00N/74HC00P ซึ่งเป็น NAND Gate 4 ช่อง ดังนั้นเราจะใช้ NAND Gate ในการสร้างวงจรต่าง ๆ

## การต่อ Half Adder ด้วย NAND

![NOR Functionally Complete](../../../public/images/cu-intania/2110263-digital-logic-lab/lab-4-nand-half-adder.png)

## การต่อ Full Adder ด้วย NAND

![NOR Functionally Complete](../../../public/images/cu-intania/2110263-digital-logic-lab/lab-4-nand-full-adder.png)
