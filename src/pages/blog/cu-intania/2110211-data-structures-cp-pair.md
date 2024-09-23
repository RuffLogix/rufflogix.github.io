---
layout: "../../../layouts/PostLayout.astro"
title: "Data Structures (2110211) - CP::pair"
date: "2024-09-23"
published: false
description: "สรุปเนื้อหาวิชา Data Structures (2110211) ภาคเรียนที่ 1 ปีการศึกษา 2567"
author: "RuffLogix"
image:
    url: "../../../images/cu-intania/2110211-data-structures/thumbnail.png"
    alt: "Data Structures"
tags: ["CU Intania x CP", "2110211"]
---

## Table of Contents

- [Pair](#pair)
- [Const Keyword](#const-keyword)
- [Pass-by-value และ Pass-by-reference](#pass-by-value-และ-pass-by-reference)
- [Header File (.h)](#header-file-h)
- [Exercises](#exercises)
- [Lecture Slide](#lecture-slide)

## Pair

โครงสร้างข้อมูลที่เก็บข้อมูล 2 ค่า​ โดยทั้งสองค่านั้นไม่จำเป็นต้องเป็นประเภทเดียวกันก็ได้ โดยเราสามารถเรียกข้อมูลด้วย `first` และ `second`

```cpp
#ifndef _CP_PAIR_INCLUDED
#define _CP_PAIR_INCLUDED

#include <iostream>

namespace CP {
    template <typename T1, typename T2>
    class pair {
        public:
            T1 first;
            T2 second;

        pair(): first(), second() { }
        pair(const T1 &a, const T2 &b): first(a), second(b) { }

        bool operator== (const pair<T1, T2> &other) const {
            return (first == other.first && second == other.second);
        }

        bool operator!= (const pair<T1, T2> &other) const {
            return (first != other.first || second != other.second);
        }

        bool operator< (const pair<T1, T2> &other) const {
            if (first == other.first) return second < other.second;
            return first < other.first;
        }

        bool operator> (const pair<T1, T2> &other) const {
            if (first == other.first) return second > other.second;
            return first > other.first;
        }
    };
}
#endif
```

**Note**: `#ifndef` และ `#define` ใช้สำหรับป้องกันการ include ไฟล์ซ้ำ

## Const Keyword

### Const Member Function

เป็นการประกาศฟังก์ชันที่ไม่สามารถแก้ไขค่าของ object ได้

```cpp
class Example {
    public:
        int x;

        void change_x(int &a) const {
            a = 10; // Ok
            x = 10; // Error
        }
};
```

### Const Parameter

เป็นการประกาศ parameter ที่ไม่สามารถแก้ไขค่าได้

```cpp
void change_x(const int &a) {
    a = 10; // Error
}
```

## Pass-by-value และ Pass-by-reference

- Pass-by-value
  - argument เป็นได้ทั้ง constant และ variable
  - การแก้ค่าของ parameter จะไม่ส่งผลต่อค่าของ argument
  - ค่าของ argument จะถูก copy ไปยัง parameter (ช้ากว่า pass-by-reference)
- Pass-by-reference
  - argument เป็นได้แค่ variable (ยกเว้นจะประกาศ `const`)
  - การแก้ค่าของ parameter จะส่งผลต่อค่าของ argument
  - ส่งที่อยู่ของ argument ไปยัง parameter แทนการ copy (เร็วกว่า pass-by-value)

## Header File (.h)

เราสามารถใช้งานโค้ดเดิมในไฟล์อื่นได้ โดยการ include ไฟล์ที่เราเขียนไว้

```cpp
#include "filename.h"
```

- ลดการเขียนโค้ดซ้ำ
- ทำให้โค้ดมีความสะดวกมากขึ้น
- เวลาแก้ไขโค้ด จะทำในไฟล์เดียว และทุกไฟล์ที่ include ไปจะเปลี่ยนตามไปด้วย

## Exercises

1. Modify `operator<` so that it compare `second` before `first`
2. Modify `operator<` so that when we call `sort(v.begin(), v.end())` where `v` is a vector of our pair, it is sorted from `Max` to `Min`
3. Write `operator!=` and `operator>=`

## Lecture Slide

- [CP::pair](https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2023_1/35349/materials/08_pair-1291-16939678450379.pdf)
