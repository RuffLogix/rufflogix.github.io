---
layout: "../../layouts/PostLayout.astro"
title: "Digital Logic Lab (2110263) - Lab 3"
date: "2024-09-13"
published: true
description: "สรุปเนื้อหาวิชา Digital Logic Lab (2110263) ภาคเรียนที่ 1 ปีการศึกษา 2567"
author: "RuffLogix"
image:
    url: "../../images/cu-intania/2110263-digital-logic-lab/thumbnail.png"
    alt: "Digital Logic Lab"
tags: ["CU Intania x CP"]
---

## Table of Contents

- [การเข้ารหัส (Encoding)](#การเข้ารหัส-encoding)
  - [Binary Code](#binary-code)
  - [Self-Complementing Code](#self-complementing-code)
  - [Cyclical Code](#cyclical-code)
  - [Weighted Code](#weighted-code)
- [Error Detection and Correction](#error-detection-and-correction)
  - [Parity Check](#parity-check)
  - [Hamming Code](#hamming-code)


สัปดาห์นี้หลัก ๆ จะเป็นการทำความคุ้นเคยกับการย่อขนาดวงจรด้วย [Espresso](https://github.com/classabbyamp/espresso-logic) ซึ่งทำให้วงจรที่ได้มีขนาดเล็กลง และ ความซับซ้อนที่น้อยลง

## การเข้ารหัส (Encoding)

|$\text{Decimal}$|$\text{Binary}$|$\text{Excess-3}$|$\text{Cyclic}$|$\text{2 4 2 1 code}$|$\text{6 4 2 -3 code}$|
|:---:|:---:|:---:|:---:|:---:|:---:|
|$0$|$\text{0 0 0 0}$|$\text{0 0 1 1}$|$\text{0 0 0 0}$|$\text{0 0 0 0}$|$\text{0 0 0 0}$|
|$1$|$\text{0 0 0 1}$|$\text{0 1 0 0}$|$\text{0 0 0 1}$|$\text{0 0 0 1}$|$\text{0 1 0 1}$|
|$2$|$\text{0 0 1 0}$|$\text{0 1 0 1}$|$\text{0 0 1 1}$|$\text{0 0 1 0}$|$\text{0 0 1 0}$|
|$3$|$\text{0 0 1 1}$|$\text{0 1 1 0}$|$\text{0 0 1 0}$|$\text{0 0 1 1}$|$\text{1 0 0 1}$|
|$4$|$\text{0 1 0 0}$|$\text{0 1 1 1}$|$\text{0 1 1 0}$|$\text{0 1 0 0}$|$\text{0 1 0 0}$|
|$5$|$\text{0 1 0 1}$|$\text{1 0 0 0}$|$\text{0 1 1 1}$|$\text{1 0 1 1}$|$\text{1 0 1 1}$|
|$6$|$\text{0 1 1 0}$|$\text{1 0 0 1}$|$\text{0 1 0 1}$|$\text{1 1 0 0}$|$\text{0 1 1 0}$|
|$7$|$\text{0 1 1 1}$|$\text{1 0 1 0}$|$\text{0 1 0 0}$|$\text{1 1 0 1}$|$\text{1 1 0 1}$|
|$8$|$\text{1 0 0 0}$|$\text{1 0 1 1}$|$\text{1 1 0 0}$|$\text{1 1 1 0}$|$\text{1 0 1 0}$|
|$9$|$\text{1 0 0 1}$|$\text{1 1 0 0}$|$\text{1 1 0 1}$|$\text{1 1 1 1}$|$\text{1 1 1 1}$|

### Binary Code

เป็นรหัสที่ใช้เลขฐาน 2 ในการแทนค่าของตัวเลข 0 และ 1

### Self-Complementing Code

เมื่อเรา invert ค่าจาก 0 เป็น 1 และ 1 เป็น 0 แล้ว เลขใหม่ที่ได้เมื่อบวกกับเลขเดิมจะมีค่าเท่ากับ 9

ตัวอย่าง

- `Excess-3 Code` ค่าเดิมคือ 3 (0110) และ ค่าใหม่คือ 6 (1001)
- `2 4 2 1 Code` ค่าเดิมคือ 3 (0011) และ ค่าใหม่คือ 6 (1100)
- `6 4 2 -3 Code` ค่าเดิมคือ 3 (1001) และ ค่าใหม่คือ 6 (0110)

### Cyclical Code

จำนวนที่เรียงติดกันจะต่างกันเพียง 1 บิตเท่านั้น เช่น Gray Code

### Weighted Code

เป็นการให้น้ำหนักสัมประสิทธิ์ตัวหน้าของแต่ละบิตต่างกัน

ตัวอย่าง

- `2 4 2 1 Code` ค่าของ 3 เขียนแทนได้ด้วย $(0011)_2$ ซึ่ง $(0 \times 2) + (0 \times 4) + (1 \times 2) + (1 \times 1) = 3$
- `6 4 2 -3 Code` ค่าของ 3 เขียนแทนได้ด้วย $(1001)_2$ ซึ่ง $(1 \times 6) + (0 \times 4) + (0 \times 2) + (1 \times -3) = 3$

## Error Detection & Error Correction

### Parity Check

เราสามารถใช้จำนวนของ 1 ในการตรวจสอบว่าข้อมูลที่ส่งไปนั้นถูกต้องหรือไม่ได้ โดยการเพิ่ม 1 เข้าไปในข้อมูล

- ถ้าพบว่าค่าที่ได้รับมามี 1 เป็นจำนวนคู่ แสดงว่าข้อมูลนั้นถูกต้อง
- ถ้าพบว่าค่าที่ได้รับมามี 1 เป็นจำนวนคี่ แสดงว่ามีข้อผิดพลาดเกิดขึ้น

โดยวิธีนี้เรียกว่า **Single Bit Error Detection** ซึ่งสามารถตรวจสอบข้อผิดพลาดได้เพียง 1 บิตเท่านั้น

|$\text{Decimal}$|$\text{8 4 2 1 p}$|$\text{2-out-of-5 Code}$|
|:---:|:---:|:---:|
|$0$|$\text{0 0 0 0 0}$|$\text{0 0 0 1 1}$|
|$1$|$\text{0 0 0 1 1}$|$\text{1 1 0 0 0}$|
|$2$|$\text{0 0 1 0 1}$|$\text{1 0 1 0 0}$|
|$3$|$\text{0 0 1 1 0}$|$\text{0 1 1 0 0}$|
|$4$|$\text{0 1 0 0 1}$|$\text{1 0 0 1 0}$|
|$5$|$\text{0 1 0 1 0}$|$\text{0 1 0 1 0}$|
|$6$|$\text{0 1 1 0 0}$|$\text{0 0 1 1 0}$|
|$7$|$\text{0 1 1 1 1}$|$\text{1 0 0 0 1}$|
|$8$|$\text{1 0 0 0 1}$|$\text{0 1 0 0 1}$|
|$9$|$\text{1 0 0 1 0}$|$\text{0 0 1 0 1}$|

### Hamming Code

[Hamming code](https://www.youtube.com/watch?v=WdmGSWrcMvM) เป็น **Single Bit Error Correction** ประเภทหนึ่งสำหรับเลข 0 - 9 นั้นใช้ 7 บิตในการแทน

- $p_n$ แทน bit ที่เป็น parity
- $d_n$ แทน bit ที่เป็น data

|$\text{Decimal}$|$\text{p1 p2 d1 p3 d2 d3 d4}$|
|:---:|:---:|
|$0$|$\text{0 0 0 0 0 0 0}$|
|$1$|$\text{1 1 0 1 0 0 1}$|
|$2$|$\text{0 1 0 1 0 1 0}$|
|$3$|$\text{1 0 0 0 0 1 1}$|
|$4$|$\text{1 0 0 1 1 0 0}$|
|$5$|$\text{0 1 0 0 1 0 1}$|
|$6$|$\text{1 1 0 0 1 1 0}$|
|$7$|$\text{0 0 0 1 1 1 1}$|
|$8$|$\text{1 1 1 0 0 0 0}$|
|$9$|$\text{0 0 1 1 0 0 1}$|

เราสามารถหาตำแหน่งที่ผิดพลาดได้โดยหาค่าของ $C_1, C_2, C_3$ จาก

- $C_1 = p_3 \oplus d_2 \oplus d_3 \oplus d_4$
- $C_2 = p_2 \oplus d_1 \oplus d_3 \oplus d_4$
- $C_3 = p_1 \oplus d_1 \oplus d_2 \oplus d_4$

ค่า $C_1 C_2 C_3$ จะบอกว่าตำแหน่งที่ผิดอยู่ตรงไหน เช่น ถ้า $C_1 C_2 C_3 = 101$ แสดงว่าตำแหน่งที่ 5 ไม่ถูกต้อง
