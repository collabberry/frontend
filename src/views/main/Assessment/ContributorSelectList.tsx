import { Contributor } from "@/models/Organization.model";
import { RootState } from "@/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ContributorSelectList: React.FC = () => {
  const [selectedContributors, setSelectedContributors] = useState<string[]>(
    []
  );

  const contributors = useSelector(
    (state: RootState) => state.auth.org.contributors
  );

  const handleSelect = (contributor: Contributor) => {
    setSelectedContributors((prevSelected) =>
      prevSelected.includes(contributor.id)
        ? prevSelected.filter(
            (contributorId) => contributorId !== contributor.id
          )
        : [...prevSelected, contributor.id]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedContributorObj = (contributors || []).filter((contributor) =>
      selectedContributors.includes(contributor.id)
    );
    console.log("Selected Contributors: ", selectedContributorObj);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select a Contributor</h3>
      <ul>
        {(contributors || []).map((contributor) => (
          <li key={contributor.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedContributors.includes(contributor.id)}
                onChange={() => handleSelect(contributor)}
              />
              {contributor.username}
            </label>
          </li>
        ))}
      </ul>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContributorSelectList;
