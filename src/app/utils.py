def calculate_run_rate(runs, balls):
    if balls == 0:
        return 0.0
    return (runs / balls) * 6  # Run rate per over

def calculate_striker_rate(runs, balls):
    if balls == 0:
        return 0.0
    return (runs / balls) * 100  # Striker rate as a percentage

def calculate_overs_left(current_ball):
    # Extract overs and balls from current position
    completed_overs = int(current_ball)
    balls_in_current_over = int((current_ball - completed_overs) * 10)

    # Calculate total balls bowled
    total_balls_bowled = completed_overs * 6 + balls_in_current_over

    # Calculate remaining balls (T20 = 20 overs = 120 balls)
    remaining_balls = 120 - total_balls_bowled

    # Convert remaining balls back to overs.balls format
    remaining_overs = remaining_balls // 6
    remaining_balls_in_over = remaining_balls % 6

    # Combine to get the final result
    result = remaining_overs + (remaining_balls_in_over / 10.0)

    return result
