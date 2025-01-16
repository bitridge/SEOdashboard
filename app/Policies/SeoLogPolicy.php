<?php

namespace App\Policies;

use App\Models\SeoLog;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SeoLogPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SeoLog $seoLog): bool
    {
        return $user->role === 'admin' || $user->id === $seoLog->provider_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SeoLog $seoLog): bool
    {
        return $user->role === 'admin' || $user->id === $seoLog->provider_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SeoLog $seoLog): bool
    {
        return $user->role === 'admin' || $user->id === $seoLog->provider_id;
    }
}
