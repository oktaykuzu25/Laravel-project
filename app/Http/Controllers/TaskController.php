<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Giriş yapan kullanıcının görevlerini listele.
     */
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->latest()->get();

        return TaskResource::collection($tasks);
    }

    /**
     * Yeni görev oluştur (otomatik olarak kullanıcıya bağlı).
     */
    public function store(StoreTaskRequest $request)
    {
        // tasks() ilişkisi üzerinden create -> user_id otomatik atanır.
        $task = $request->user()->tasks()->create($request->validated());

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Tek bir görevi göster (sadece sahibi erişebilir).
     */
    public function show(Request $request, string $id)
    {
        // Sorgu kullanıcıdan başladığı için başkasının görevi otomatik 404 olur.
        $task = $request->user()->tasks()->findOrFail($id);

        return new TaskResource($task);
    }

    /**
     * Görevi güncelle.
     */
    public function update(UpdateTaskRequest $request, string $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $task->update($request->validated());

        return new TaskResource($task);
    }

    /**
     * Görevi sil.
     */
    public function destroy(Request $request, string $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $task->delete();

        return response()->json(['message' => 'Görev silindi.']);
    }
}
