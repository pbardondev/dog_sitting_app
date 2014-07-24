module Api
  class DogsController < ApplicationController
    wrap_parameters :dog, include: [:name, :age, :description, :size, :dog_photo]
    def create
      @dog = current_user.dogs.new(dog_params)

      if @dog.save
        render json: @dog
      else
        render json: @dog.errors.full_messages, status: :unprocessable_entity
      end
    end

    def index
      @dogs = current_user.dogs
      render json: @dogs
    end

    def show
      @dog = Dog.find(params[:id]);
      render json: @dog
    end

    def update
      @dog = Dog.find(params[:id]);
      if @dog.update_attributes(dog_params)
        render json: @dog
      else
        render json: @dog.errors.full_messages, status: :unprocessable_entity
      end
    end

    private

    def dog_params
      params.require(:dog).permit(:name, :age, :description, :size, :dog_photo)
    end

  end
end
