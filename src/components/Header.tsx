interface HeaderProps {
  title: string;
  date: Date | string;
  onEdit(): void;
}

export const Header = ({ title, date, onEdit }: HeaderProps) => {
  return (
    <div style={{ width: "100vw", height: "50px", background: "green" }}>
      {title} - {typeof date === "string" ? date : date.toDateString()}
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};
