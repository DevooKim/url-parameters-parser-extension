<div align="center">
<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/3bc108f9-7ba8-48c4-82ab-c6531f4c393c" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/10b0f256-38f8-45ff-8b27-fbf86c0d785b" />
    <img alt="Logo" src="https://github.com/user-attachments/assets/3bc108f9-7ba8-48c4-82ab-c6531f4c393c" />
</picture>
</div>

## Table Of Contents
- [Table Of Contents](#table-of-contents)
- [Intro](#intro)
- [Install](#install)
- [Features](#features)
- [Options](#options)
- [TODO](#todo)


## Intro
This extension is parses the URL with parameters.


```
URL: https://example.com/aaa/111/bbb/222/ccc/333

patterns: ["/aaa/:a_id", "/bbb:b_id", "/ccc:c_id"]

result : { "a_id": 111, "b_id": 222, "c_id": 333 }
```
<img width="422" alt="image" src="https://github.com/user-attachments/assets/de984925-5d55-4720-93eb-ae91bd19952f" />


## Install
[Download Zip](https://github.com/user-attachments/files/19291059/extension-20250316-200153.zip)

## Features
- [base on](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/0.4.3?tab=readme-ov-file#features)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide](https://lucide.dev/)

## Options
```json
[
    {
        "name": "example",
        "patterns": [
            "/aaa/:a_id",
            "/bbb/:b_id",
            "/ccc/:c_id"
        ]
    }
]
```

## TODO
- [ ] Button to go to the options page
- [ ] Save with keystrokes on the Options page
- [x] Export/Import options
- [ ] Automatically select options that match the hostname
- [ ] Dark Theme
- [ ] i18n
- [ ] fancy UI
- [ ] github action - release builder
- [ ] validate import file



---

Base on [chrome-extension-boilerplate-react-vite@0.4.3](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/0.4.3)
