export const getCultureScoreDescription = (score: number): any => {
  switch (score) {
    case 1:
      return (
        <>
          <div className="font-bold">Frequently disrupted team culture. ☹️</div>
          <div>
            Regularly displayed behaviors that damaged team morale, hindered
            collaboration, or violated team values.
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className="font-bold">Occasionally undermined team culture. 😐</div>
          <div>
            Exhibited behaviors that hindered collaboration, discouraged open
            communication, or created negativity within the team.
          </div>
        </>
      );
    case 3:
      return (
        <>
          <div className="font-bold">Neutral impact on culture. 🙂</div>
          <div>
            Met expectations for collaboration, but didn't actively influence
            the team culture positively or negatively.
          </div>
        </>
      );
    case 4:
      return (
        <>
          <div className="font-bold">
            Regularly contributed to a positive culture. 😀
          </div>
          <div>
            Participated in team activities, offered support to team members,
            and demonstrated behaviors that align with team values.
          </div>
        </>
      );
    case 5:
      return (
        <>
          <div className="font-bold">
            Consistently championed positive culture. 🤩
          </div>
          <div>
            Actively promoted team values, fostered collaboration, and inspired
            a healthy and productive environment.
          </div>
        </>
      );
    default:
      return <></>;
  }
};

export const getWorkContributionDescription = (score: number): any => {
  switch (score) {
    case 1:
      return (
        <>
          <div className="font-bold">
            Frequently fell short of expectations. ☹️
          </div>
          <div>
            Regularly missed deadlines, required significant support to complete
            tasks, or produced work with consistent quality issues.
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className="font-bold">
            Occasionally fell short of expectations. 😐
          </div>
          <div>
            Missed some deadlines, required additional support to complete
            tasks, or produced work with occasional quality issues.
          </div>
        </>
      );
    case 3:
      return (
        <>
          <div className="font-bold">Met expectations. 🙂</div>
          <div>
            Delivered assigned work on time and at an acceptable quality level.
            Collaborated effectively with team members and fulfilled their role
            within the team.
          </div>
        </>
      );
    case 4:
      return (
        <>
          <div className="font-bold">
            Regularly met and surpassed expectations. 😀
          </div>
          <div>
            Consistently delivered high-quality work on time, actively
            participated in projects, and took initiative to solve problems or
            improve processes.
          </div>
        </>
      );
    case 5:
      return (
        <>
          <div className="font-bold">Consistently exceeded expectations. 🤩</div>
          <div>
            Delivered high-quality work consistently, often exceeded deadlines
            and went above and beyond taken tasks. 
            {/* Contributed innovative
            solutions and significantly improved team efficiency. */}
          </div>
        </>
      );
    default:
      return <></>;
  }
};
