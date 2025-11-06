#!/bin/bash

# Скрипт для установки всех необходимых shadcn компонентов

cd /home/user/crmauto/frontend

echo "Установка shadcn/ui компонентов для админки..."

# Core компоненты для таблиц и форм
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add alert
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add calendar
npx shadcn@latest add data-table

echo "Все компоненты установлены!"
