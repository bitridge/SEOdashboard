<?php

namespace App\Policies;

use App\Models\SeoLog;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SeoLogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Everyone can view logs, but controller filters based on role
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SeoLog $seoLog): bool
    {
        return $user->isAdmin() || $user->id === $seoLog->provider_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isProvider(); // Only providers can create logs
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SeoLog $seoLog): bool
    {
        return $user->isAdmin() || $user->id === $seoLog->provider_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SeoLog $seoLog): bool
    {
        return $user->isAdmin() || $user->id === $seoLog->provider_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SeoLog $seoLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SeoLog $seoLog): bool
    {
        return false;
    }
}
