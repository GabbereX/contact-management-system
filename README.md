# Система управления контактными данными клиентов.

[DEMO](https://gabberex.ru/portfolio/contact-management-system/)

## Запуск через терминал
- перейти в папку **crm-backend**
> cd crm-backend
- запустить **index.js**
>node index.js
____
В терминале должен появиться текст:
>Сервер CRM запущен. Вы можете использовать его по адресу http://localhost:3000
Нажмите CTRL+C, чтобы остановить сервер                                                                                                                          
Доступные методы:                                                                                                                                                
GET /api/clients - получить список клиентов, в query параметр search можно передать поисковый запрос                                                             
POST /api/clients - создать клиента, в теле запроса нужно передать объект { name: string, surname: string, lastName?: string, contacts?: object[] }              
contacts - массив объектов контактов вида { type: string, value: string }                                                                                
GET /api/clients/{id} - получить клиента по его ID                                                                                                               
PATCH /api/clients/{id} - изменить клиента с ID, в теле запроса нужно передать объект { name?: string, surname?: string, lastName?: string, contacts?: object[] }
contacts - массив объектов контактов вида { type: string, value: string }                                                                                
DELETE /api/clients/{id} - удалить клиента по ID
____
## Запустите index.html (например через LiveServer или Serve).

### Возможности:
- Добавление клиента
- Удаление клиента
- Редактирование клиентских данных
- Поиск конкретного клиента (фильтрация)
- Сортировка клиентов
- Возможность передать ссылку на конкретного клиента
