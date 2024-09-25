---
layout: "../../../layouts/PostLayout.astro"
title: "Data Structures (2110211) - CP::vector"
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

- [Vector](#vector)
- [Pointer](#pointer)
- [New และ Delete](#new-และ-delete)
- [Lecture Slide](#lecture-slide)

## Vector

โครงสร้างข้อมูลที่เป็น dynamic array ซึ่งประกอบไปด้วย 3 อย่างหลัก ๆ

- `mData` คือ pointer ไปยัง array ของข้อมูล
- `mSize` คือ จำนวนข้อมูลที่มีอยู่ใน vector ณ ขณะนั้น
- `mCap` คือ ขนาดของ array ข้อมูลที่ vector สามารถเก็บได้

### Adding Element(s)

เราจะทำการเพิ่มข้อมูลไว้ที่ด้านหลังของ dynamic array ดังนี้

- เช็คว่า dynamic array เต็มหรือยัง
  - ถ้าเต็ม ให้เพิ่มขนาดของ dynamic array ขึ้น 2 เท่า (โดยทำการ reallocate memory ใหม่)
- เพิ่มข้อมูลใหม่ไว้ที่ด้านหลังของ dynamic array

ซึ่งการเพิ่มขนาด dynamic array ใหม่จะทำให้เวลาโดยเฉลี่ยของ `push_back()` เป็น $O(1)$

```cpp
#ifndef _CP_VECTOR_INCLUDED
#define _CP_VECTOR_INCLUDED

#include <iostream>
#include <stdexcept>

namespace CP {
    template <typename T>
    class vector {
    public:
        typedef T* iterator;

    protected:
        T *mData;
        size_t mCap;
        size_t mSize;

        void rangeCheck(int n) {
            if (n < 0 || n >= mSize) {
                throw std::out_of_range("index of out range") ;
            }
        }

        void expand(size_t capacity) {
            T *arr = new T[capacity]();
            for (size_t i = 0;i < mSize;i++) {
                arr[i] = mData[i];
            }
            delete [] mData;
            mData = arr;
            mCap = capacity;
        }

        void ensureCapacity(size_t capacity) {
            if (capacity > mCap) {
                size_t s = (capacity > 2 * mCap) ? capacity : 2 * mCap;
                expand(s);
            }
        }

    public:
        vector(const vector<T>& a) {
            mData = new T[a.capacity()]();
            mCap = a.capacity();
            mSize = a.size();
            for (size_t i = 0;i < a.size();i++) {
                mData[i] = a[i];
            }
        }

        vector() {
            mData = new T[1]();
            mCap = 1;
            mSize = 0;
        }

        vector(size_t capacity) {
            mData = new T[capacity]();
            mCap = capacity;
            mSize = capacity;
        }

        vector<T>& operator=(vector<T> other) {
            using std::swap;
            swap(this->mSize, other.mSize);
            swap(this->mCap, other.mCap);
            swap(this->mData, other.mData);
            return *this;
        }

        ~vector() {
            delete [] mData;
        }

        bool empty() const {
            return mSize == 0;
        }

        size_t size() const {
            return mSize;
        }

        size_t capacity() const {
            return mCap;
        }

        void resize(size_t n) {
            if (n > mCap) {
                expand(n);
            }

            if (n > mSize) {
                T init = T();
                for (size_t i = mSize;i < n;i++)
                mData[i] = init;
            }

            mSize = n;
        }

        iterator begin() {
            return &mData[0];
        }

        iterator end() {
            return begin()+mSize;
        }

        T& at(int index) {
            rangeCheck(index);
            return mData[index];
        }

        T& at(int index) const {
            rangeCheck(index);
            return mData[index];
        }

        T& operator[](int index) {
            return mData[index];
        }

        T& operator[](int index) const {
            return mData[index];
        }

        void push_back(const T& element) {
            insert(end(),element);
        }

        void pop_back() {
            mSize--;
        }

        iterator insert(iterator it,const T& element) {
            size_t pos = it - begin();
            ensureCapacity(mSize + 1);
            for(size_t i = mSize;i > pos;i--) {
                mData[i] = mData[i-1];
            }
            mData[pos] = element;
            mSize++;
            return begin()+pos;
        }

        void erase(iterator it) {
            while((it+1)!=end()) {
                *it = *(it+1);
                it++;
            }
            mSize--;
        }

        void clear() {
            mSize = 0;
        }


        void insert_by_pos(size_t it,const T& element) {
            insert(begin()+it,element);
        }

        void erase_by_pos(int index) {
            erase(begin()+index);
        }

        void erase_by_value(const T& element) {
            int i = index_of(element);
            if (i != -1) erase_by_pos(i);
        }

        bool contains(const T& element) {
            return index_of(element) != -1;
        }

        int index_of(const T& element) {
            for (int i = 0;i < mSize;i++) {
                if (mData[i] == element) {
                return i;
                }
            }
            return -1;
        }
    };
}
#endif
```

## Pointer

Pointer คือตัวแปรที่เก็บ address ของตัวแปรอื่น ๆ ในหน่วยความจำ

- Pointer จำเป็นต้องมี type โดย pointer จะมีขนาดเท่ากับขนาดของ type ของตัวแปรที่ pointer ชี้ไป
- `&` คือ operator ที่ใช้ถามหา address ของตัวแปร
- `*` คือ operator ที่ใช้ถามหาค่าของ address ที่ pointer ชี้ไป

### Pointer Arithmetic

- `Pointer Addition` คือ การบวก pointer กับ ตัวเลข `n` ซึ่งจะเป็นการขยับ pointer ไป `n` block of memory
- `Pointer Substraction` คือ การลบ pointer กับ pointer ซึ่งจะเป็นการหาว่า pointer ทั้งสองห่างกันกี่ block of memory

## `new` และ `delete`

- `new` คือ operator ที่ใช้สร้าง object ใหม่ในหน่วยความจำ
- `delete` คือ operator ที่ใช้ลบ object ออกจากหน่วยความจำ

```cpp
class Example { };

int main() {
    Example *ex = new Example;
    delete ex;

    Example *exs = new Example[4]();
    delete [] exs;
}
```

### Memory Leak

ปัญหาที่เกิดจากการใช้หน่วยความจำโดยไม่ปล่อยหน่วยความจำที่ใช้ไป ซึ่งจะทำให้หน่วยความจำที่ใช้ไปไม่สามารถใช้งานได้อีก

- การใช้ `new` แล้วไม่ใช้ `delete` จะทำให้เกิด memory leak ได้

## Lecture Slide

- [CP::vector](https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2023_1/35349/materials/09_vector-1291-16939713602663.pdf)
