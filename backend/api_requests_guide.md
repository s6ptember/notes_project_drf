# API Руководство - Notes Application

## Базовый URL
```
http://localhost:8000/notes/
```

## 1. Получить список всех заметок

**GET** `/notes/`

**Описание:** Получает список всех заметок в системе

**Пример запроса:**
```bash
curl -X GET "http://localhost:8000/notes/"
```

**Пример ответа (200 OK):**
```json
[
    {
        "id": 1,
        "title": "Моя первая заметка",
        "content": "Содержание первой заметки",
        "created_at": "2025-08-01T10:30:00Z",
        "updated_at": "2025-08-01T10:30:00Z"
    },
    {
        "id": 2,
        "title": "Вторая заметка",
        "content": "Содержание второй заметки",
        "created_at": "2025-08-01T11:00:00Z",
        "updated_at": "2025-08-01T11:15:00Z"
    }
]
```

---

## 2. Создать новую заметку

**POST** `/notes/`

**Описание:** Создает новую заметку

**Заголовки:**
```
Content-Type: application/json
```

**Тело запроса:**
```json
{
    "title": "Название заметки",
    "content": "Содержание заметки"
}
```

**Пример запроса:**
```bash
curl -X POST "http://localhost:8000/notes/" \
     -H "Content-Type: application/json" \
     -d '{
         "title": "Новая заметка",
         "content": "Это содержание новой заметки"
     }'
```

**Пример успешного ответа (201 Created):**
```json
{
    "id": 3,
    "title": "Новая заметка",
    "content": "Это содержание новой заметки",
    "created_at": "2025-08-01T12:00:00Z",
    "updated_at": "2025-08-01T12:00:00Z"
}
```

**Пример ошибки валидации (400 Bad Request):**
```json
{
    "title": ["Заголовок не может быть пустым"],
    "content": ["Содержание не может быть пустым"]
}
```

---

## 3. Получить конкретную заметку

**GET** `/notes/{id}`

**Описание:** Получает заметку по её ID

**Параметры URL:**
- `id` (integer) - ID заметки

**Пример запроса:**
```bash
curl -X GET "http://localhost:8000/notes/1"
```

**Пример успешного ответа (200 OK):**
```json
{
    "id": 1,
    "title": "Моя первая заметка",
    "content": "Содержание первой заметки",
    "created_at": "2025-08-01T10:30:00Z",
    "updated_at": "2025-08-01T10:30:00Z"
}
```

**Пример ошибки (404 Not Found):**
```json
{
    "detail": "Not found."
}
```

---

## 4. Полное обновление заметки

**PUT** `/notes/{id}`

**Описание:** Полностью обновляет заметку (требуются все поля)

**Параметры URL:**
- `id` (integer) - ID заметки

**Заголовки:**
```
Content-Type: application/json
```

**Тело запроса:**
```json
{
    "title": "Обновленное название",
    "content": "Обновленное содержание"
}
```

**Пример запроса:**
```bash
curl -X PUT "http://localhost:8000/notes/1" \
     -H "Content-Type: application/json" \
     -d '{
         "title": "Обновленная заметка",
         "content": "Новое содержание заметки"
     }'
```

**Пример успешного ответа (200 OK):**
```json
{
    "id": 1,
    "title": "Обновленная заметка",
    "content": "Новое содержание заметки",
    "created_at": "2025-08-01T10:30:00Z",
    "updated_at": "2025-08-01T12:30:00Z"
}
```

---

## 5. Частичное обновление заметки

**PATCH** `/notes/{id}`

**Описание:** Частично обновляет заметку (можно передать только нужные поля)

**Параметры URL:**
- `id` (integer) - ID заметки

**Заголовки:**
```
Content-Type: application/json
```

**Примеры тела запроса:**

Обновить только заголовок:
```json
{
    "title": "Новый заголовок"
}
```

Обновить только содержание:
```json
{
    "content": "Новое содержание"
}
```

Обновить оба поля:
```json
{
    "title": "Новый заголовок",
    "content": "Новое содержание"
}
```

**Пример запроса:**
```bash
curl -X PATCH "http://localhost:8000/notes/1" \
     -H "Content-Type: application/json" \
     -d '{
         "title": "Частично обновленный заголовок"
     }'
```

**Пример успешного ответа (200 OK):**
```json
{
    "id": 1,
    "title": "Частично обновленный заголовок",
    "content": "Старое содержание остается",
    "created_at": "2025-08-01T10:30:00Z",
    "updated_at": "2025-08-01T12:45:00Z"
}
```

---

## 6. Удалить заметку

**DELETE** `/notes/{id}`

**Описание:** Удаляет заметку по её ID

**Параметры URL:**
- `id` (integer) - ID заметки

**Пример запроса:**
```bash
curl -X DELETE "http://localhost:8000/notes/1"
```

**Пример успешного ответа (204 No Content):**
```json
{
    "message": "Заметка успешно удалена"
}
```

**Пример ошибки (404 Not Found):**
```json
{
    "detail": "Not found."
}
```

---

## Коды ошибок

- **200 OK** - Запрос выполнен успешно
- **201 Created** - Ресурс создан успешно
- **204 No Content** - Запрос выполнен успешно, содержимое отсутствует
- **400 Bad Request** - Ошибка валидации данных
- **404 Not Found** - Ресурс не найден
- **405 Method Not Allowed** - Метод не разрешен для данного URL
- **500 Internal Server Error** - Внутренняя ошибка сервера

---

## Валидация

### Поле "title":
- Не может быть пустым
- Максимум 200 символов
- Автоматически обрезаются пробелы в начале и конце
- HTML-символы экранируются

### Поле "content":
- Не может быть пустым
- Максимум 10,000 символов
- Автоматически обрезаются пробелы в начале и конце
- HTML-символы экранируются

---

## Примеры использования в разных языках

### Python (requests):
```python
import requests

# Получить все заметки
response = requests.get('http://localhost:8000/notes/')
notes = response.json()

# Создать заметку
data = {
    'title': 'Заметка из Python',
    'content': 'Содержание заметки'
}
response = requests.post('http://localhost:8000/notes/', json=data)
new_note = response.json()

# Обновить заметку
update_data = {'title': 'Обновленный заголовок'}
response = requests.patch(f'http://localhost:8000/notes/{new_note["id"]}', json=update_data)

# Удалить заметку
response = requests.delete(f'http://localhost:8000/notes/{new_note["id"]}')
```

### JavaScript (fetch):
```javascript
// Получить все заметки
fetch('http://localhost:8000/notes/')
    .then(response => response.json())
    .then(data => console.log(data));

// Создать заметку
fetch('http://localhost:8000/notes/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'JS заметка',
        content: 'Содержание из JavaScript'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## Тестирование API

Для тестирования API можно использовать:
- **Postman** - графический интерфейс для тестирования API
- **curl** - командная строка (примеры выше)
- **httpie** - альтернатива curl с более простым синтаксисом
- **Swagger/OpenAPI** - если добавите документацию

### Пример с httpie:
```bash
# Получить все заметки
http GET localhost:8000/notes/

# Создать заметку
http POST localhost:8000/notes/ title="HTTPie заметка" content="Тест"

# Обновить заметку
http PATCH localhost:8000/notes/1 title="Новый заголовок"

# Удалить заметку
http DELETE localhost:8000/notes/1
```