interface HeaderProps {
  title: string;
  date: Date;
  onEdit(): void;
}

export const Header = ({ title, date, onEdit }: HeaderProps) => {
  return (
    <div style={{ width: "100vw", height: "50px", background: "green" }}>
      {title} - {date.toDateString()}
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};
