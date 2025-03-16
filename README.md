## Table Of Contents
- [Table Of Contents](#table-of-contents)
- [Intro](#intro)
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
- [ ] Export/Import options
- [ ] Automatically select options that match the hostname
- [ ] Dark Theme
- [ ] i18n
- [ ] fancy UI
- [ ] github action - release builder



---

Base on [chrome-extension-boilerplate-react-vite@0.4.3](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/0.4.3)
