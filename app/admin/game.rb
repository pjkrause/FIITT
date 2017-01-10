ActiveAdmin.register Game do

  permit_params :title, :description, :first_step, :game_image

  form :partial => "form"

  show :title => :title do

    panel "Game Details" do
      attributes_table_for game do
        row :id
        row :title
        row :description
        row :first_step
        row :created_at
        row :updated_at
        row("Game image") { |game| image_tag game.game_image.button.url }
      end
    end
  end

end
