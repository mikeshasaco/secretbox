<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'owner_user_id' => User::factory(),
            'name' => $this->faker->company . ' Project',
            'description' => $this->faker->optional()->sentence(),
            'website_url' => $this->faker->optional()->url(),
            'public_key' => 'pk_' . bin2hex(random_bytes(16)),
            'secret_key' => 'sk_' . bin2hex(random_bytes(16)),
            'is_active' => true,
        ];
    }
}