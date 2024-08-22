---
layout: "../../layouts/PostLayout.astro"
title: "Summer Camp 2024 - Day 4"
date: "2024-04-20"
published: true
description: "The lecture notes from the C++ class on day 4 of the LOC summer camp."
author: "RuffLogix"
image:
    url: "../images/rufflogix512.png"
    alt: "RuffLogix Logo"
tags: ["League of Code Summer Camp (2024)"]
---

## Function

`Function` เป็นส่วนของโค้ดที่ถูกประกาศไว้ล่วงหน้าสำหรับใช้งานในอนาคต ซึ่งทำให้โค้ดนั้นอ่านง่ายขึ้น และช่วยให้การทำงานบางอย่างนั้นซับซ้อนน้อยลงด้วย ซึ่งการประกาศ Function นั้นประกอบไปด้วย 4 ส่วนหลัก ๆ

1. ประเภทของ Function
2. ชื่อของ Function
3. Parameters ที่รับ
4. การทำงานภายใน Function

`Function ที่ไม่คืนค่า`
```cpp
void sayHello() {
    cout << "Hello World\n";
}
```
`Function ที่คืนค่าเป็น integer`
```cpp
int add(int a, int b) {
    return a + b;
}
```

ซึ่งเราสามารถเรียกใช้ Function ได้ผ่านการเรียกชื่อ Function และใส่ Arguments ลงไป (ถ้ามี) เช่น `sayHello()` หรือ `add(3, 5)` เป็นต้น

### Parameter & Argument

- `Parameter` คือ ตัวแปรที่ถูกประกาศไว้ใน Function
- `Argument` คือ ค่าที่ถูกส่งให้ Parameter ที่อยู่ใน Function

```cpp
// a และ b เป็น parameter
int add(int a, int b) {
    return a + b;
}

add(3, 5) // 3 และ 5 เป็น argument
```

### Prototype

เป็นการประกาศ Function โดยที่ยังไม่บอกถึงการทำงานภายใน เพื่อให้โปรแกรมรู้จักกับ Function ก่อน

```cpp
int add(int a, int b);

int add(int a, int b) {
    return a + b;
}
```

### Example

โจทย์: จงเขียนโปรแกรมสร้างรูปสี่เหลี่ยมที่มีขนาด $N \times N$ โดยใช้ Function

ข้อมูลนำเข้า

- จำนวนเต็ม $N$ แทน ขนาดของรูปสี่เหลี่ยม

ข้อมูลส่งออก

- รูปสี่เหลี่ยมขนาด $ N \times N $ ที่ประกอบไปด้วยตัวอักษร `'#'`

```cpp
#include <iostream>

using namespace std;

void printRect(int n) {
    for (int i=1; i<=n; i++) {
        for (int j=1; j<=n; j++) {
            cout << '#';
        }
        cout << '\n';
    }
}

int main() {
    ios_base::sync_with_stdio(0), cin.tie(0);

    int n;
    cin >> n;

    printRect(n);

    return 0;
}
```

### Pass by Value & Pass by Reference

ในการส่งค่าให้แก่ Function สามารถแบ่งได้เป็น 2 ประเภท ได้แก่

1. `Pass by Value` คือ การคัดลอกค่าของข้อมูลและส่งให้แก่ Function (ข้อมูลเหมือนเดิมแต่อยู่ในตำแหน่งใหม่)
2. `Pass by Reference` คือ การส่งที่อยู่ของข้อมูลให้แก่ Function (ข้อมูลและตำแหน่งเดิม)

#### Pass by Value

```cpp
void add(int a, int b, int result) {
    result = a + b;
}
```

#### Pass by Reference

```cpp
void add(int a, int b, int &result) {
    result = a + b;
}
```

## Recursive Function

`Recursive Function` คือ Function ที่แก้ปัญหาโดยการแบ่งปัญหาเป็นส่วนย่อย ๆ แล้วส่งให้ Function ตัวเองไปเรื่อย ๆ จนปัญหามีขนาดเล็กมากพอ ซึ่งเราสามารถแบ่งการทำงานได้เป็น 2 ประเภท

- `base case` คือ กรณีที่ปัญหาเล็กพอ โดยไม่ต้องทำการเรียกตัวเองแล้ว
- `recursive case` คือ กรณีที่เกิดการแบ่งปัญหาเพื่อเรียกตัวเอง

### Example

`โจทย์`: จงเขียนโปรแกรมหา [Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_sequence) ลำดับที่ $ N $ เมื่อให้ $ F(1)=1, \ F(2)=1 $ สำหรับ $ 1 \leq N \leq 2 $ และ $ F(N) = F(N-1) + F(N-2) $ สำหรับ $ N > 2 $

ข้อมูลนำเข้า

- จำนวนเต็ม $ N $ แทน ลำดับของ Fibonacci ที่เราต้องการทราบ

ข้อมูลส่งออก

- ค่าของ Fibonacci ลำดับที่ $ N $

```cpp
#include <iostream>

using namespace std;

int fib(int n) {
    if (n==1 || n==0) return n;

    return fib(n-1) + fib(n-2);
}

int main() {
    int n;
    cin >> n;

    cout << fib(n) << '\n';

    return 0;
}
```

## Practice Problems

- [Great Common Divisor](https://programming.in.th/tasks/0014)
- [Activity](https://programming.in.th/tasks/0036)
- [Food](https://programming.in.th/tasks/0039)
