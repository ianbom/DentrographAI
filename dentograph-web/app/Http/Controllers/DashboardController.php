<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    

    public function index(Request $request, DashboardService $service): Response
{
    // Pastikan $request->user()->role benar-benar 'dokter' atau 'admin'
    return Inertia::render('dashboard/index', $service->getDashboardData($request->user()));
}
}
