---
layout: "../../../layouts/PostLayout.astro"
title: "Data Structures (2110211) - CP::stack"
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

- [Stack](#stack)

## Stack

โครงสร้างข้อมูลที่ทำงานแบบ [Last-in First-out (LIFO)](https://www.geeksforgeeks.org/lifo-last-in-first-out-approach-in-programming/) ซึ่งมีการดำเนินการหลัก ๆ ดังนี้

- `push(x)` เพิ่มข้อมูลเข้าไปใน stack
- `pop()` นำข้อมูลออกจาก stack
- `top()` ดูข้อมูลที่อยู่บนสุดของ stack
- `empty()` ตรวจสอบว่า stack ว่างหรือไม่
- `size()` ดูขนาดของ stack

โดยแต่ละการดำเนินการจะใช้เวลาเพียง $O(1)$ เท่านั้น

```cpp
#ifndef _CP_STACK_INCLUDED
#define _CP_STACK_INCLUDED

#include <iostream>

namespace CP {
    template <typename T>
    class stack {
        protected:
            T *mData;
            size_t mSize;
            size_t mCap;

            void expand(size_t capacity) {
                T *arr = new T[capacity]();
                for (size_t i=0; i<mSize; i++) {
                    arr[i] = mData[i];
                }
                delete [] mData;
                mData = arr;
                mCap = capacity;
            }

            void ensureCapacity(size_t capacity) {
                if (capacity > mCap) {
                    size_t newCapacity = (capacity > mCap * 2) ? capacity : mCap * 2;
                    expand(newCapacity);
                }
            }
        public:
            stack() {
                mData = new T[1]();
                mCap = 1;
                mSize = 1;
            }

            stack(const stack<T> &s) {
                ensureCapacity(s.size());
                for (size_t i=0; i<s.size(); i++) {
                    this->mData[i] = s.mData[i];
                }
            }

            stack<T>& operator= (const stack<T>& other) {
                using std::swap;
                ensureCapacity(other.mCap);
                for (size_t i=0; i<other.mSize; i++) {
                    this->mData[i] = other.mData[i];
                }
                this->mSize = other.mSize;
                return *this;
            }

            ~stack() {
                delete [] mData;
            }

            bool empty() const {
                return mSize == 0;
            }

            size_t size() const {
                return mSize;
            }

            T& top() const {
                return mData[size() - 1];
            }

            void push(const T& element) {
                ensureCapacity(mCap + 1);
                mData[mSize++] = element;
            }

            void pop() {
                mSize--;
            }
    };
}
#endif
```
