class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])

    respond_to do |format|
      format.json { render json: GameSerializer.new(@game, {}) }
    end
  end

  def update
    errors = []
    updated_model = ""

    @game = Game.find(params[:id])

    if params[:game]
      if @game
        @game.title = game_update_params[:title]
        @game.description = game_update_params[:description]
        @game.first_step = game_update_params[:first_step]
        if @game.save
          updated_model = "Game"
        else
          errors << @game.errors.full_messages
        end
      else
        errors << "Game id #{params[:id]} not found"
      end
    end

    if params[:step]
      @step = Step.find(step_update_params[:id])
      if @step
        @step.status_message = step_update_params[:status_message]

        if @step.save
          updated_model = "Step"
        else
          errors << @step.errors.full_messages
        end
      else
        errors << "Step id #{step_update_params[:id]} not found"
      end
    end

    if params[:decision]
      @decision = Decision.find(decision_update_params[:id])
      if @decision
        @decision.choice = decision_update_params[:choice]

        if @decision.save
          updated_model = "Decision"
        else
          errors << @decision.errors.full_messages
        end
      else
        errors << "Decision id #{decision_update_params[:id]} not found"
      end
    end


    if errors.count > 0
      flash[:error] = errors.to_sentence
    else
      flash[:notice] = "#{updated_model} updated"
    end

    redirect_to edit_admin_game_path(@game)
  end

  def update_layout
    errors = []

    if games_params[:steps]
      games_params[:steps].each do |step|
        step = step[1]
        step_to_update = Step.find(step[:id].to_i)
        if step_to_update
          step_to_update.x_position = step[:x_position]
          step_to_update.y_position = step[:y_position]
          unless step_to_update.save
            errors << "step_id #{step[:id]}: #{step_to_update.errors.full_messages}"
          end
        else
          errors << "Step id #{step[:id]}: not found"
        end
      end
    end

    if games_params[:decisions]
      games_params[:decisions].each do |decision|
        decision = decision[1]
        decision_to_update = Decision.find(decision[:id].to_i)
        if decision_to_update
          decision_to_update.x_position = decision[:x_position]
          decision_to_update.y_position = decision[:y_position]
          unless decision_to_update.save
            errors << "decision_id #{decision[:id]}: #{decision_to_update.errors.full_messages}"
          end
        else
          errors << "decision_id #{decision[:id]}: not found"
        end
      end
    end

    if games_params[:pan_x] || games_params[:pan_y] || games_params[:zoom] || games_params[:x] || games_params[:y]
      game_to_update = Game.find(games_params[:id])

      if game_to_update
        if games_params[:pan_x]
          game_to_update.pan_x_position = games_params[:pan_x]
        end
        if games_params[:pan_y]
          game_to_update.pan_y_position = games_params[:pan_y]
        end
        if games_params[:zoom]
          game_to_update.zoom = games_params[:zoom]
        end
        if games_params[:x]
          game_to_update.x_position = games_params[:x]
        end
        if games_params[:y]
          game_to_update.y_position = games_params[:y]
        end

        unless game_to_update.save
          errors << "game_id #{games_params[:id]}: #{game_to_update.errors.full_messages}"
        end
      else
        errors << "game_id #{games_params[:id]}: not found"
      end
    end

    if errors.count == 0
      render json: :success
    else
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  def delete_layout_item
    errors = []

    @game = Game.find(params[:id])

    if games_params[:steps]
      games_params[:steps].each do |step|
        step = step[1]
        step_to_update = Step.find(step[:id].to_i)
        if step_to_update
          if step_to_update.destroy
            if @game.first_step == step_to_update.id
              @game.first_step = nil
              @game.save
            end
          else
            errors << "step_id #{step[:id]}: #{step_to_update.errors.full_messages}"
          end
        else
          errors << "Step id #{step[:id]}: not found"
        end
      end
    end

    if games_params[:decisions]
      games_params[:decisions].each do |decision|
        decision = decision[1]
        decision_to_update = Decision.find(decision[:id].to_i)
        if decision_to_update
          unless decision_to_update.destroy
            errors << "decision_id #{decision[:id]}: #{decision_to_update.errors.full_messages}"
          end
        else
          errors << "decision_id #{decision[:id]}: not found"
        end
      end
    end

    if errors.count == 0
      render status: :ok, json: {
        message: "Successfully deleted.",
        game: GameSerializer.new(@game)
      }.to_json
    else
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  def add_layout_item
    errors = []

    @game = Game.find(params[:id])

    if games_params[:item_type]
      if games_params[:item_type] == "step"
        new_step = @game.steps.build({})
        unless new_step.save
          errors << "Error creating new step: #{new_step.errors.full_messages}"
        end
      end

      if games_params[:item_type] == "decision"
        new_decision = @game.decisions.build({})
        unless new_decision.save
          errors << "Error creating new decision: #{new_decision.errors.full_messages}"
        end
      end
    end

    if errors.count == 0
      if games_params[:item_type] == "step"
        render status: :created, json: {
          message: "Successfully created new step",
          step: StepSerializer.new(new_step, {})
        }.to_json
      elsif games_params[:item_type] == "decision"
        render status: :created, json: {
          message: "Successfully created new step",
          decision: new_decision
        }.to_json
      end
    else
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  def add_connection
    errors = []

    @game = Game.find(params[:id])

    if games_params[:first_step]
      @game.update({first_step: games_params[:first_step]})
    end

    if games_params[:steps]
      games_params[:steps].each do |step|
        step = step[1]
        step_to_update = Step.find(step[:id].to_i)
        if step_to_update
          step_to_update.default_step = step[:default_step]
          unless step_to_update.save
            errors << "step_id #{step[:id]}: #{step_to_update.errors.full_messages}"
          end
        else
          errors << "step_id #{step[:id]}: not found"
        end
      end
    end

    outcome_to_update = nil

    if games_params[:outcomes]
      games_params[:outcomes].each do |outcome|
        outcome = outcome[1]
        if outcome[:id].to_i < 2147483647
          existing_outcome = Outcome.exists?(outcome[:id])
        end
        outcome[:id] = "" unless existing_outcome

        outcome_to_update = Outcome.find_or_create_by({id: outcome[:id]})
        outcome_to_update.update({
          step_id: outcome[:step],
          decision_ids: outcome[:decision_ids],
          outcome_step_id: outcome[:outcome],
          colour: outcome[:colour]
        })

        unless outcome_to_update.save
          errors << "outcome : #{outcome_to_update.errors.full_messages}"
        end
      end
    end

    if errors.count == 0
      render json: { outcomes: outcome_to_update }
    else
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  def delete_connection
    errors = []

    @game = Game.find(params[:id])

    if games_params[:outcomes]
      games_params[:outcomes].each do |outcome|
        outcome = outcome[1]
        existing_outcome = Outcome.exists?(outcome[:id])
        outcome[:id] = "" unless existing_outcome

        outcome_to_delete = Outcome.find(outcome[:id])

        unless outcome_to_delete.destroy
          errors << "outcome : #{outcome_to_delete.errors.full_messages}"
        end
      end
    end

    if errors.count == 0
      render json: :success
    else
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  private

  def games_params
    params.require(:games).permit(
      :id, :x, :y, :pan_x, :pan_y, :zoom, :item_type, :first_step,
      steps: [:id, :x_position, :y_position, :default_step],
      decisions: [:id, :x_position, :y_position, :next_step],
      outcomes: [:id, :step, :outcome, :colour, decision_ids: []]
    )
  end

  def game_update_params
    params.require(:game).permit(
      :id,
      :title,
      :description,
      :first_step
    )
  end

  def step_update_params
    params.require(:step).permit(
      :id,
      :status_message
    )
  end

  def decision_update_params
    params.require(:decision).permit(
      :id,
      :choice
    )
  end
end
