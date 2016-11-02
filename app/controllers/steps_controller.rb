class StepsController < ApplicationController
  include CurrentStatus
  before_action :set_step, only: [:end_game]
  before_action :get_status, only: [:show, :end_game]
  before_action :set_next_step, only: [:show] #, :end_game]


  # GET /steps
  # GET /steps.json
  def index

  end

  def about

  end

  def games
    @games = Game.all
    if current_player
      @statuses = Status.where("player_id = ? and completed = false", current_player.id)
    else
      @statuses = []
    end
  end

  def player
    if current_player
      @statuses = Status.where("player_id = ?", current_player.id)
    else
      @statuses = []
    end
  end


  # GET /steps/1
  # GET /steps/1.json
  # Setting up the status session variable may need to take place earlier
  # than this if we want to offer the option to restart an incomplete session
  def start
    @step = Step.find(params[:id])
    @choices = Outcome.where(step_id: @step.id)
    @decision_choices = Decision.where(id: @choices.each.map { |choice| choice.decision_ids }.flatten.uniq )
    @messages = @step.stakeholder_messages
    @status = Status.create(player_id: current_player.id, game_id: @step.game_id, trace: {"0"=>[[], @step.id]})
    set_status(@status.id)
  end

  def show
    @choices = Outcome.where(step_id: @step.id)
    @decision_choices = Decision.where(id: @choices.each.map { |choice| choice.decision_ids }.flatten.uniq )
    @status.day_no += 1 # @status.day_no + @decision.days
    @status.trace["#{@status.day_no}"] = [@key, @step.id] # I think this should be current_step
    @status.save
    if @decision_choices == []
      redirect_to action: "end_game", id: @step
    else
    #  @choices = Choices.new
      @messages = @step.stakeholder_messages
#      @status.external_communication = @status.external_communication + @decision.ec
#      @status.internal_communication = @status.internal_communication + @decision.ic
#      @status.media_perception = @status.media_perception + @decision.mp
#      @status.public_perception = @status.public_perception + @decision.pp
    end
  end

  def resume
    @status = Status.find(params[:id])
    set_status(@status.id)
    set_resumed_step(@status)
    @decision_choices = @step.decisions
    if @decision_choices == []
      redirect_to action: "end_game", id: @step
    else
      @messages = @step.stakeholder_messages
    end
    render :show
  end

  def end_game
    # @step = Step.find(params[:id])
#    @status.day_no += 1 # @status.day_no + @decision.days
#    @status.trace["#{@status.day_no}"] = [@key, @step.id]
    @messages = @step.stakeholder_messages
#    @status.external_communication = @status.external_communication + @decision.ec
#    @status.internal_communication = @status.internal_communication + @decision.ic
#    @status.media_perception = @status.media_perception + @decision.mp
#    @status.public_perception = @status.public_perception + @decision.pp
    @status.completed = true
    @status.save
    respond_to do |format|
      format.html
      format.pdf do
        pdf = ReportPdf.new(@status)
        send_data pdf.render, filename: "fiitt_report#{@status.updated_at}.pdf",
                              type: "application/pdf",
                              disposition: "inline"
      end
    end

  end

  def report
    @status = Status.find(params[:id])
    respond_to do |format|
      format.pdf do
        pdf = ReportPdf.new(@status)
        send_data pdf.render, filename: "fiitt_report#{@status.updated_at}.pdf",
                              type: "application/pdf",
                              disposition: "inline"
      end
    end
  end

  # GET /steps/new
  def new
    @step = Step.new
  end

  # GET /steps/1/edit
  def edit
  end

  # POST /steps
  # POST /steps.json
  def create
    @step = Step.new(step_params)

    respond_to do |format|
      if @step.save
        format.html { redirect_to @step, notice: 'Step was successfully created.' }
        format.json { render :show, status: :created, location: @step }
      else
        format.html { render :new }
        format.json { render json: @step.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /steps/1
  # PATCH/PUT /steps/1.json
  def update
    respond_to do |format|
      if @step.update(step_params)
        format.html { redirect_to @step, notice: 'Step was successfully updated.' }
        format.json { render :show, status: :ok, location: @step }
      else
        format.html { render :edit }
        format.json { render json: @step.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /steps/1
  # DELETE /steps/1.json
  def destroy
    @step.destroy
    respond_to do |format|
      format.html { redirect_to steps_url, notice: 'Step was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_step
      @step = Step.find(params[:id])
    end

    def set_next_step
      decision_ids = params[:decisions]["decision_ids"].map{|i| i.to_i }.reject{|i| i == 0}.join(",")
      next_steps = Outcome.where(step_id: params[:current_step], decision_ids: "{#{decision_ids}}")
      if next_steps.count == 1
        @step = Step.find(next_steps.first.outcome_step_id)
      else
        @step = Step.find(current_step)
      end
    end

    def set_resumed_step(status)
      values = []
      status.trace.each_value {|value| values << value}
      id = values.last.split(',').last.split(']').first.to_i
      @step = Step.find(id)
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def step_params
      params.require(:step).permit(:general_message, :status_message)
      params.require(:choices).permit(choice_ids: [])
    end
end
