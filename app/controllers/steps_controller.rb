class StepsController < ApplicationController
  include CurrentStatus
  before_action :set_step, only: [:show, :edit, :update, :destroy]
  before_action :get_status, only: [:show]
  before_action :set_next_step, only: [:show]


  # GET /steps
  # GET /steps.json
  def index
    @steps = Step.all
  end

  # GET /steps/1
  # GET /steps/1.json
  # Setting up the status session variable may need to take place earlier
  # than this if we want to offer the option to restart an incomplete session
  def start
    @step = Step.find(1)
    @decision_choices = @step.decisions
    @messages = @step.stakeholder_messages
    @status = Status.create(player_id: current_player.id)
    set_status(@status.id)
  end

  def show
    @decision_choices = @step.decisions
    @messages = @step.stakeholder_messages
    @status.day_no = @status.day_no + @decision.days
    @status.external_communication = @status.external_communication + @decision.ec
    @status.internal_communication = @status.internal_communication + @decision.ic
    @status.media_perception = @status.media_perception + @decision.mp
    @status.public_perception = @status.public_perception + @decision.pp
    @status.save
#    respond_to do |format|
#      format.html { redirect_to @step }
#      format.json { render :show, location: @step }
#    end
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
      @decision = Decision.find(params[:id])       
      @step = Step.find(@decision.next_step)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def step_params
      params.require(:step).permit(:general_message, :status_message)
    end
end
